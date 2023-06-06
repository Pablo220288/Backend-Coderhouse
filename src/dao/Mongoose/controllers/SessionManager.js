import userModel from '../models/UserSchema.js'
import { createHash, validatePassword } from '../../../utils/bcrypt.js'
import { io } from '../../../index.js'
import UserService from '../../../services/userService.js'
import { sendMailRecovery } from '../../../utils/mail.js'
import { cartProduct } from '../../../routes/products.routes.js'
import { findOneRole } from '../../../services/roleService.js'

const userService = new UserService()
class SessionManager {
  getSession = (req, res, next) => {
    try {
      if (req.isAuthenticated() && req.session.login) {
        return res.status(200).redirect('/products')
      } else {
        let register = req.session.register
        if (register === undefined) {
          register = {
            firstName: '',
            lastName: '',
            age: '',
            emailRegister: ''
          }
        }
        io.on('connection', socket => {
          socket.on('recovery', async data => {
            const user = await userService.findOneUser(data)
            if (user == null) {
              io.sockets.emit('recoveryError')
            } else {
              const id = user.id
              const nameUser = `${user.firstName} ${user.lastName}`
              sendMailRecovery(data, id, nameUser)
              io.sockets.emit('recoverySend')
            }
          })
        })
        res.status(200).render('login', {
          title: 'Login | Signup',
          noNav: true,
          noFooter: true,
          email: req.session.email,
          messageLogin: req.session.messageErrorLogin,
          signup: req.session.signup,
          messageSignup: req.session.messageErrorSignup,
          firstName: register.firstName,
          lastName: register.lastName,
          age: register.age,
          emailRegister: register.emailRegister,
          messageNewUser: req.session.messageNewUser,
          emailExpired: req.query.emailExpired
        })
      }
    } catch (err) {
      res.status(500).send('Error al ingresar', err)
    }
  }

  testLogin = async (req, res, next) => {
    try {
      const user = await userModel.findOne({ email: req.body.email })
      req.session.messageNewUser = ''
      if (user == null) {
        req.session.messageErrorLogin = 'Invalid email'
        req.session.email = ''
        return res.status(200).redirect('/api/session')
      } else if (!validatePassword(req.body.password, user.password)) {
        req.session.messageErrorLogin = 'Incorrect password'
        req.session.email = user.email
        return res.status(200).redirect('/api/session')
      } else {
        req.session.messageErrorLogin = ''
        req.session.email = user.email
        req.session.login = true
        return res.status(200).redirect('/products')
      }
    } catch (err) {
      res.status(500).send('Error al crear', err)
    }
  }

  createUser = async (req, res, next) => {
    try {
      const { firstName, lastName, age, email, password, passwordConfirm } =
        req.body
      req.session.messageErrorLogin = ''
      req.session.messageNewUser = ''
      req.session.register = {
        firstName,
        lastName,
        age,
        emailRegister: email,
        password,
        passwordConfirm
      }
      const user = await userModel.findOne({ email })
      if (
        !firstName ||
        !lastName ||
        !age ||
        !email ||
        !password ||
        !passwordConfirm
      ) {
        req.session.signup = true
        req.session.messageErrorSignup = 'All fields are requerid'
        return res.status(200).redirect('/api/session')
      } else if (user != null) {
        req.session.messageErrorSignup = 'Registered User. Log in..'
        req.session.signup = true
        req.session.email = email
        return res.status(200).redirect('/api/session')
      } else if (password !== passwordConfirm) {
        req.session.messageErrorSignup = 'Password do not match, check again..'
        req.session.signup = true
        req.session.email = email
        return res.status(200).redirect('/api/session')
      } else {
        const passEncripted = createHash(password)
        const newUser = {
          firstName,
          lastName,
          age: parseInt(age),
          email,
          password: passEncripted
        }
        await userModel.create(newUser)
        req.session.messageErrorSignup = ''
        req.session.signup = false
        req.session.email = email
        req.session.messageNewUser = 'You are registered. Log in..'
        return res.status(200).redirect('/api/session')
      }
    } catch (err) {
      res.status(500).send('Error al cerrar sesion', err)
    }
  }

  destroySession = (req, res, next) => {
    try {
      req.session.destroy()
      return res.status(200).redirect('/api/session')
    } catch (err) {
      res.status(500).send('Error al cerrar sesion', err)
    }
  }

  profile = async (req, res, next) => {
    try {
      const user = await userService.findByIdUser(req.session.passport.user)
      // Cargamos los productos que tenga en el carrito
      const productsCart = await cartProduct(user.cart._id.toString())
      let emptyCart = false
      if (productsCart.totalCart === 0) emptyCart = true
      // Selector de Role
      let { roleAdmin, roleModerator, roleUser } = false
      if (user.roles[0].name === 'admin') {
        roleAdmin = true
      } else if (user.roles[0].name === 'moderator') {
        roleModerator = true
      } else {
        roleUser = true
      }
      res.status(200).render('profile', {
        title: 'Profile | Setting',
        nameUser: `${user.firstName} ${user.lastName}`,
        id: user.id,
        email: user.email,
        age: user.age,
        roleAdmin,
        roleModerator,
        roleUser,
        created: user.createdAt.toLocaleDateString(),
        cartsProducts: productsCart.productsInCart,
        totalCart: productsCart.totalCart,
        emptyCart,
        countCart: productsCart.countCart
      })
    } catch (error) {
      res.status(500).send(`Error al Ingresar a Setting: ${error}`)
    }
  }

  profileUpdate = async (req, res, next) => {
    const user = await userService.findByIdUser(req.session.passport.user)
    const { age, role } = req.body

    // Buscamos el ID del nuevo Role
    const newRole = await findOneRole(role)

    await userService.updateUser(user.id, {
      age,
      roles: [newRole._id]
    })
    res.status(200).redirect('/api/session/profile')
  }
}

export default SessionManager
