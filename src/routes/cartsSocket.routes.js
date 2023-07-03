import { Router } from 'express'
import { io } from '../index.js'
import CartMongooseManager from '../dao/Mongoose/controllers/CartsManager.js'
import { logger } from '../utils/logger.js'
import UserService from '../services/userService.js'
import { cartProduct } from './home.routes.js'

const cartSocketRouter = Router()
const cartsByMongoose = new CartMongooseManager()
const userService = new UserService()

cartSocketRouter.get('/', async (req, res) => {
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
  io.on('connection', socket => {
    socket.on('messaje', data => {
      logger.info(data)
      // Mensaje del Servidor
      io.sockets.emit('estado', 'Conectado con el Servidor por Sockets')
    })
    // Consultamos Carritos y Productos en Carrito por ID
    socket.on('getCart', async data => {
      const byIdCart = await cartsByMongoose.findCartsById(data)
      if (data === '') {
        io.sockets.emit('getCart', {
          messaje: 'Se consultaron todos los Carritos',
          cart: true,
          carts: await cartsByMongoose.findCarts(),
          itemId: 'Id Carrito',
          itemQuantity: 'Productos'
        })
      } else if (byIdCart === 'Carrito no Encontrado') {
        io.sockets.emit('getCart', {
          messaje: byIdCart,
          cart: true,
          carts: [],
          itemId: 'Id Carrito',
          itemQuantity: 'Productos'
        })
      } else {
        const producsInCart = []
        for (let i = 0; i < byIdCart.payload.products.length; i++) {
          const product = {
            id: byIdCart.payload.products[i]._id._id,
            title: byIdCart.payload.products[i]._id.title,
            quantity: byIdCart.payload.products[i].quantity
          }
          producsInCart.push(product)
        }
        io.sockets.emit('getCart', {
          messaje: 'Consulta Exitosa',
          cart: false,
          products: producsInCart,
          itemId: 'Producto',
          itemQuantity: 'Cantidad'
        })
      }
    })
    // Agergar Carrito
    socket.on('addCart', async () => {
      const addCart = await cartsByMongoose.createCarts()
      io.sockets.emit('addCart', {
        messaje: addCart,
        cart: true,
        carts: await cartsByMongoose.findCarts(),
        itemId: 'Id Carrito',
        itemQuantity: 'Productos'
      })
    })
    // Agregar Producto en Carrito
    socket.on('productInCart', async data => {
      const addProduct = await cartsByMongoose.addProductToCart(
        data.idCart,
        data.idProduct
      )
      io.sockets.emit('productInCart', {
        messaje: addProduct,
        cart: true,
        carts: await cartsByMongoose.findCarts(),
        itemId: 'Id Carrito',
        itemQuantity: 'Productos'
      })
    })
    // Eliminar Carrito
    socket.on('deleteCart', async data => {
      const deleteCart = await cartsByMongoose.deleteCarts(data)
      io.sockets.emit('deleteCart', {
        messaje: deleteCart,
        cart: true,
        carts: await cartsByMongoose.findCarts(),
        itemId: 'Id Carrito',
        itemQuantity: 'Productos'
      })
    })
  })

  // Render por defecto
  res.render('realTimeCarts', {
    title: 'Carts | Websockets',
    navCarts: true,
    noFooter: true,
    nameUser: `${user.firstName} ${user.lastName}`,
    rol: req.session.role,
    roleAdmin,
    cartsProducts: productsCart.productsInCart,
    totalCart: productsCart.totalCart,
    emptyCart,
    countCart: productsCart.countCart
  })
})

export default cartSocketRouter
