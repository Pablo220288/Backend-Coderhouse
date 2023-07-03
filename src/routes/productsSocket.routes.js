import { Router } from 'express'
import CrudMongoose from '../dao/Mongoose/controllers/ProductManager.js'
import UserService from '../services/userService.js'
import { io } from '../index.js'
import { logger } from '../utils/logger.js'
import { isAdmin } from '../middlewares/authRole.js'
import { cartProduct } from './home.routes.js'

const productSocketRouter = Router()
const Products = new CrudMongoose()
const userService = new UserService()

productSocketRouter.get('/', isAdmin, async (req, res) => {
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
  // Websockets
  const products = await Products.findProductsAll()
  // Recibimos peticion de coneccion Cliente
  io.on('connection', socket => {
    socket.on('messaje', data => {
      logger.info(data)
      // Mensaje del Servidor
      io.sockets.emit('estado', 'Conectado con el Servidor por Sockets')
    })

    // Recivimos peticion de Consultar producto del cliente
    socket.on('getProduct', async data => {
      const byIdProducts = await Products.findProductsById(data)
      if (data === '') {
        io.sockets.emit('getProduct', {
          messaje: 'Se consultaron todos los Productos',
          products
        })
      } else if (byIdProducts === 'Producto no Encontrado') {
        io.sockets.emit('getProduct', {
          messaje: byIdProducts,
          products: []
        })
      } else {
        io.sockets.emit('getProduct', {
          messaje: 'Consulta Exitosa',
          products: [byIdProducts]
        })
      }
    })

    // Recivimos peticion de Agergar producto del cliente
    socket.on('addProduct', async data => {
      // Enviamos en ID del Usuario que Creo el Producto
      const user = req.session.passport.user
      // Enviamos el Producto creado
      const addProduct = await Products.createProducts(JSON.parse(data), user)
      io.sockets.emit('addProduct', {
        messaje: addProduct.message,
        products
      })
    })

    // Recibimos peticion de Actualizar producto
    socket.on('putProduct', async data => {
      const owner = req.session.passport.user
      const updateProduct = await Products.updateProducts(
        data.id,
        owner,
        JSON.parse(data.info)
      )
      io.sockets.emit('putProduct', {
        messaje: updateProduct.message,
        products
      })
    })

    // Recibimos peticion de Eliminar producto
    socket.on('deleteProduct', async data => {
      const deleteProduct = await Products.deleteProductsById(data)
      io.sockets.emit('deleteProduct', {
        messaje: deleteProduct.success,
        products
      })
    })
  })

  // Render por defecto
  //  res.send(products)
  res.render('realTimeProducts', {
    title: 'Products | Websockets',
    navProducts: true,
    noFooter: true,
    nameUser: `${user.firstName} ${user.lastName}`,
    rol: req.session.role,
    products,
    roleAdmin,
    cartsProducts: productsCart.productsInCart,
    totalCart: productsCart.totalCart,
    emptyCart,
    countCart: productsCart.countCart
  })
})

export default productSocketRouter
