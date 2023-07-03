import userModel from '../models/UserSchema.js'
import { createHash, validatePassword } from '../../../utils/bcrypt.js'
import { io } from '../../../index.js'
import UserService from '../../../services/userService.js'
import { sendMailRecovery } from '../../../utils/mail.js'
import { cartProduct } from '../../../routes/home.routes.js'
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

  destroySession = async (req, res, next) => {
    try {
      const user = await userService.findByIdUser(req.session.passport.user)
      console.log(user)
      console.log(user._id)
      // Cargamos el momento en el que el usuario se desconecto
      await userService.updateUser(user._id, {
        loutConnection: new Date()
      })
      // Cerrramos la sesion
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
      // Gestion avatar => false = icono generico / true = avatar de usuario
      let avatar = false
      let fileAvatar = ''
      if (user.documents.some(documents => documents.name === 'avatar')) {
        avatar = true
        const file = user.documents.find(file => file.name === 'avatar')
        fileAvatar = `/uploads/avatars/${file.file}`
      }

      // Gestion de documentos
      let identification = false
      let address = false
      let account = false
      console.log(identification, address, account)
      if (
        user.documents.some(documents => documents.name === 'identification')
      ) {
        identification = true
      }
      if (user.documents.some(documents => documents.name === 'address')) {
        address = true
      }
      if (user.documents.some(documents => documents.name === 'account')) {
        account = true
      }

      // Si tiene la documentacion puede cambiar su rol a Administrador o Moderador
      let updateAdmin = false
      let updateModerator = false

      if (identification && address && account) {
        updateAdmin = true
      }
      if (identification && address) {
        updateModerator = true
      }

      res.status(200).render('profile', {
        title: 'Profile | Setting',
        avatar,
        fileAvatar,
        nameUser: `${user.firstName} ${user.lastName}`,
        id: user.id,
        email: user.email,
        age: user.age,
        roleAdmin,
        roleModerator,
        roleUser,
        created: user.createdAt.toLocaleDateString(),
        identification,
        address,
        account,
        updateAdmin,
        updateModerator,
        cartsProducts: productsCart.productsInCart,
        totalCart: productsCart.totalCart,
        emptyCart,
        countCart: productsCart.countCart
      })

      // Socket Delete Account
      io.on('connection', socket => {
        socket.on('deleteAccount', async data => {
          const user = await userService.findByIdUser(req.session.passport.user)
          if (await userService.comparePassword(data.password, user.password)) {
            io.sockets.emit('deleteAccountSuccess')
          } else {
            io.sockets.emit('deleteAccountError')
          }
        })
      })
    } catch (error) {
      res.status(500).send(`Error al Ingresar a Setting: ${error}`)
    }
  }

  updateAvatar = async (req, res, next) => {
    const user = await userService.findByIdUser(req.session.passport.user)
    const documents = user.documents.some(
      documents => documents.name === 'avatar'
    )
    if (!documents) {
      user.documents.push({ name: 'avatar', file: req.file.filename })
      await userService.updateUser(req.session.passport.user, {
        documents: user.documents
      })
    } else {
      const indexDocument = user.documents.findIndex(
        documents => documents.name === 'avatar'
      )
      user.documents[indexDocument].file = req.file.filename
      await userService.updateUser(req.session.passport.user, {
        documents: user.documents
      })
    }

    res.status(200).redirect('/api/session/profile')
  }

  documentManagement = async (req, documentType, documentFile) => {
    const user = await userService.findByIdUser(req.session.passport.user)
    const documents = user.documents.some(
      documents => documents.name === documentType
    )
    if (!documents) {
      user.documents.push({
        name: documentType,
        file: documentFile
      })
      await userService.updateUser(req.session.passport.user, {
        documents: user.documents
      })
    } else {
      const indexDocument = user.documents.findIndex(
        documents => documents.name === documentType
      )
      user.documents[indexDocument].file = documentFile
      await userService.updateUser(req.session.passport.user, {
        documents: user.documents
      })
    }
  }

  updateDocuments = async (req, res, next) => {
    if (req.files.identification) {
      this.documentManagement(
        req,
        req.files.identification[0].fieldname,
        req.files.identification[0].filename
      )
    } else if (req.files.address) {
      this.documentManagement(
        req,
        req.files.address[0].fieldname,
        req.files.address[0].filename
      )
    } else if (req.files.account) {
      this.documentManagement(
        req,
        req.files.account[0].fieldname,
        req.files.account[0].filename
      )
    } else {
      console.l('error')
    }
    res.status(200).redirect('/api/session/profile')
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

  deleteUser = async (req, res, next) => {
    await userService.deleteUser(req.session.passport.user)
    res.status(200).redirect('/api/session')
  }
}

export default SessionManager
