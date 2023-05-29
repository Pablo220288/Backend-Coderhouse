import express, { Router } from 'express'
import __dirname from '../utils.js'
import { cartProduct } from './products.routes.js'
import { createTicket } from '../services/ticketService.js'
import { nanoid } from 'nanoid'
import { findCartByIdAndUpdate } from '../services/cartService.js'
import CrudMongoose from '../dao/Mongoose/controllers/ProductManager.js'
import UserService from '../services/userService.js'
import sendMail from '../utils/mail.js'
import ApiErrors from '../errors/apiErrors.js'

const purchaseRouter = Router()
const Products = new CrudMongoose()
const User = new UserService()
const errors = new ApiErrors()

const dataFilter = async idProduct => {
  const product = await Products.findProductsById(idProduct)
  // Obtengo sus Datos
  const {
    title,
    author,
    description,
    price,
    status,
    category,
    thumbnail,
    code,
    stock
  } = product
  return {
    title,
    author,
    description,
    price,
    status,
    category,
    thumbnail,
    code,
    stock
  }
}

purchaseRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/:id', async (req, res, next) => {
    if (req.isAuthenticated()) {
      try {
        const cart = await cartProduct(req.params.id)
        req.session.cartId = req.params.id
        // Render de la pagina
        res.render('purchase', {
          title: 'Purchase | Node js',
          nameUser: req.session.nameUser,
          rol: req.session.role,
          countCart: cart.countCart,
          cartsProducts: cart.productsInCart,
          totalCart: cart.totalCart
        })
      } catch (error) {
        next(errors.internal('Something went wrong'))
      }
    } else {
      return res.status(200).redirect('/api/session')
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const cart = await cartProduct(req.session.cartId)

      // Actualizamos el Stock de Producto
      for (let i = 0; i < cart.productsInCart.length; i++) {
        const idProduct = cart.productsInCart[i].id
        // Filtro los datos de Producto
        const dataProduct = await dataFilter(idProduct)
        // Actualizamos Stock de DB
        dataProduct.stock = dataProduct.stock - cart.productsInCart[i].quantity
        await Products.updateProducts(idProduct, dataProduct)
      }

      // Buscamos los productos del Carrito
      const productsInCart = []
      for (let i = 0; i < cart.productsInCart.length; i++) {
        const product = {
          _id: cart.productsInCart[i].id,
          name: cart.productsInCart[i].title,
          price: cart.productsInCart[i].price,
          totalPrice: cart.productsInCart[i].totalPrice,
          quantity: cart.productsInCart[i].quantity
        }
        productsInCart.push(product)
      }
      // Creamos un ticket de compra con los datos de Factucacion y Envio
      const code = nanoid(16)
      const dataTicket = {
        code,
        amount: cart.totalCart,
        namePurchase: req.body.name,
        dni: req.body.dni,
        address: `${req.body.address} ${req.body.addressNumber}`,
        products: productsInCart,
        purchaser: req.session.passport.user
      }
      await createTicket(dataTicket)
      req.session.ticketCode = code

      // Limpiamos el carrito
      await findCartByIdAndUpdate(req.session.cartId, { products: [] })

      // Enviamos Email con el Ticket de Compra
      const { email } = await User.findByIdUser(req.session.passport.user)
      sendMail(email, dataTicket)

      // Redirigimos al Ticket
      return res.status(200).redirect('/ticket')
    } catch (error) {
      next(errors.internal('Something went wrong'))
    }
  })

export default purchaseRouter
