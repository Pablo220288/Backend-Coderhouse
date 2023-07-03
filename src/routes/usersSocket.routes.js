import express, { Router } from 'express'
import __dirname from '../utils.js'
import { io } from '../index.js'
import UserService from '../services/userService.js'
import { findOneRole } from '../services/roleService.js'
import { cartProduct } from './home.routes.js'
import { isAdmin } from '../middlewares/authRole.js'
import moment from 'moment'

const userSocketRouter = Router()
const userService = new UserService()

userSocketRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/', isAdmin, async (req, res) => {
    const user = await userService.findByIdUser(req.session.passport.user)
    // Cargamos los productos que tenga en el carrito
    const productsCart = await cartProduct(user.cart._id.toString())
    let emptyCart = false
    if (productsCart.totalCart === 0) emptyCart = true
    // Le damos los accesos de admin en caso de serlo
    let { roleAdmin } = false
    if (user.roles[0].name === 'admin') {
      roleAdmin = true
    }

    // Pedimos a la DB todos los usuarios
    const users = await userService.findAllUsers()

    io.on('connection', socket => {
      socket.on('getUser', async data => {
        const userById = await userService.findByIdUser(data)
        if (data === '') {
          io.sockets.emit('getUser', {
            messaje: 'Se consultaron todos los Usuarios',
            users
          })
        } else {
          if (userById.status === 'error') {
            io.sockets.emit('getUser', {
              messaje: userById.message,
              users: []
            })
          } else {
            io.sockets.emit('getUser', {
              messaje: 'Consulta Exitosa',
              users: [userById]
            })
          }
        }
        socket.on('addUser', async data => {
          const user = await userService.findOneUser(data.email)
          if (user) {
            io.sockets.emit('addUser', {
              messaje: 'Email ya Registrado',
              users: await userService.findAllUsers()
            })
          } else {
            const role = await findOneRole('user')
            const newUser = {
              firstName: data.firstName,
              lastName: data.lastName,
              age: parseInt(data.age),
              email: data.email,
              password: await userService.encryptPassword(data.password),
              roles: [role._id],
              cart: await userService.addCartToUser()
            }
            await userService.createUser(newUser)
            io.sockets.emit('addUser', {
              messaje: 'Usuario Agregado',
              users: await userService.findAllUsers()
            })
          }
        })
        socket.on('deleteUser', async data => {
          const deleteUser = await userService.deleteUser(data)
          if (deleteUser.status === 'error') {
            io.sockets.emit('deleteUser', {
              messaje: deleteUser.message,
              users: []
            })
          } else {
            io.sockets.emit('deleteUser', {
              messaje: 'Usuario Eliminado',
              users: await userService.findAllUsers()
            })
          }
        })
        socket.on('lastDeleteUser', async () => {
          const users = await userService.findAllUsers()
          for (let i = 0; i < users.length; i++) {
            const initialDate = moment(new Date(users[i].lastConnection))
            const finalDate = moment(new Date())

            if (
              finalDate.diff(initialDate, 'minutes') > 2880 ||
              isNaN(finalDate.diff(initialDate, 'minutes'))
            ) {
              await userService.deleteUser(users[i].id)
            }
          }
          io.sockets.emit('lastDeleteUser', {
            messaje: 'Usuarios Eliminados',
            users: await userService.findAllUsers()
          })
        })
      })
    })

    // Render por defecto
    res.render('realTimeUsers', {
      title: 'Users | Websockets',
      navUser: true,
      noFooter: true,
      nameUser: `${user.firstName} ${user.lastName}`,
      rol: req.session.role,
      roleAdmin,
      users,
      cartsProducts: productsCart.productsInCart,
      totalCart: productsCart.totalCart,
      emptyCart,
      countCart: productsCart.countCart
    })
  })

export default userSocketRouter
