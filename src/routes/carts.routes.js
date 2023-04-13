import { Router } from 'express'
import CartsManager from '../dao/FileSystem/controllers/CartsManager.js'

// Importamos Router Creados
const cartsRouter = Router()
// Creamos Manero de Archvos por FileSystem
const carts = new CartsManager()

// Ruta para Agregar Carritos
cartsRouter
  .post('/', async (req, res) => {
    const newCart = await carts.addCarts()
    res.send(newCart)
  })
  // Ruta para Consultar Productos en Carrito por ID
  .get('/:id', async (req, res) => {
    const cartById = await carts.getCartById(req.params.id)
    if (cartById === 404) { return res.status(404).send({ error: 'El Carrito solicitado no existe' }) }
    res.send(cartById)
  })
  // Ruta para agregar Productos por ID a Carrito por ID
  .post('/:cid/products/:pid', async (req, res) => {
    const productInCart = await carts.addProductInCart(
      req.params.cid,
      req.params.pid
    )
    if (productInCart === 'error cart') { return res.status(404).send({ error: 'El Carrito Seleccionado no existe' }) }
    if (productInCart === 'error product') { return res.status(404).send({ error: 'El producto Seleccionado no existe' }) }
    return res.send(productInCart)
  })

export default cartsRouter
