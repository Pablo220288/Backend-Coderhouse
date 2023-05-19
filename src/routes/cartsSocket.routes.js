import { Router } from 'express'
import { io } from '../index.js'
import CartMongooseManager from '../dao/Mongoose/controllers/CartsManager.js'
import { logger } from '../../utils/logger.js'

const cartSocketRouter = Router()
const cartsByMongoose = new CartMongooseManager()

cartSocketRouter.get('/', async (req, res) => {
  io.on('connection', (socket) => {
    socket.on('messaje', (data) => {
      logger.info(data)
      // Mensaje del Servidor
      io.sockets.emit('estado', 'Conectado con el Servidor por Sockets')
    })
    // Consultamos Carritos y Productos en Carrito por ID
    socket.on('getCart', async (data) => {
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
        for (let i = 0; i < byIdCart.products.length; i++) {
          const product = {
            id: byIdCart.products[i]._id._id,
            title: byIdCart.products[i]._id.title,
            quantity: byIdCart.products[i].quantity
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
    socket.on('productInCart', async (data) => {
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
    socket.on('deleteCart', async (data) => {
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
    title: 'MnogoDB | Websockets'
  })
})

export default cartSocketRouter
