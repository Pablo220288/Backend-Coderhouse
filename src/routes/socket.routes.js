import { Router } from 'express'
import CrudMongoose from '../dao/Mongoose/controllers/ProductManager.js'
import { io } from '../index.js'

const socketRouter = Router()
const Products = new CrudMongoose()

socketRouter.get('/', async (req, res) => {
  // Websockets
  const products = await Products.findProductsAll()
  // Recibimos peticion de coneccion Cliente
  io.on('connection', socket => {
    socket.on('messaje', data => {
      console.log(data)
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
      const addProduct = await Products.createProducts(JSON.parse(data))
      io.sockets.emit('addProduct', {
        messaje: addProduct,
        products
      })
    })

    // Recibimos peticion de Actualizar producto
    socket.on('putProduct', async data => {
      const updateProduct = await Products.updateProducts(
        data.id,
        JSON.parse(data.info)
      )
      io.sockets.emit('putProduct', {
        messaje: updateProduct,
        products
      })
    })

    // Recibimos peticion de Eliminar producto
    socket.on('deleteProduct', async data => {
      const deleteProduct = await Products.deleteProductsById(data)
      io.sockets.emit('deleteProduct', {
        messaje: deleteProduct,
        products
      })
    })
  })

  // Render por defecto
  res.render('realTimeProducts', {
    title: 'Express | Websockets',
    noNav: true,
    noFooter: true,
    products
  })
})

export default socketRouter
