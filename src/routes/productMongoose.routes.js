import { Router } from 'express'
import CrudMongoose from '../dao/Mongoose/controllers/ProductManager.js'
import { isAdmin } from '../middlewares/authRole.js'

const productMongooseRouter = Router()
const productsByMongoose = new CrudMongoose()

productMongooseRouter.get('/', async (req, res) => {
  try {
    res.status(200).send(await productsByMongoose.findProducts(req.query))
  } catch (err) {
    res.status(404).send('Error en la consulta', err)
  }
})
productMongooseRouter.get('/:id', async (req, res) => {
  try {
    res
      .status(200)
      .send(await productsByMongoose.findProductsById(req.params.id))
  } catch (err) {
    res.status(404).send('Producto no encontrado', err)
  }
})
productMongooseRouter.post('/', isAdmin, async (req, res) => {
  try {
    res.status(200).send(await productsByMongoose.createProducts(req.body, req.session.passport.user))
  } catch (err) {
    res.status(400).send('Error de sintaxis', err)
  }
})
productMongooseRouter.put('/:id', isAdmin, async (req, res) => {
  try {
    res
      .status(200)
      .send(
        await productsByMongoose.updateProducts(
          req.params.id,
          req.session.passport.user,
          req.body
        )
      )
  } catch (err) {
    res.status(400).send('Error de sintaxis', err)
  }
})
productMongooseRouter.delete('/:id', isAdmin, async (req, res) => {
  try {
    res
      .status(200)
      .send(await productsByMongoose.deleteProductsById(req.params.id))
  } catch (err) {
    res.status(400).send('Error de sintaxis', err)
  }
})

export default productMongooseRouter
