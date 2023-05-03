import express, { Router } from 'express'
import __dirname from '../utils.js'
import { cartProduct } from './products.routes.js'
import { createTicket } from '../services/ticketService.js'
import { nanoid } from 'nanoid'
import { findCartByIdAndUpdate } from '../services/cartService.js'

const purchaseRouter = Router()

purchaseRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/:id', async (req, res) => {
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
        res.status(500).send(error)
      }
    } else {
      return res.status(200).redirect('/api/session')
    }
  })
  .post('/', async (req, res) => {
    try {
      const cart = await cartProduct(req.session.cartId)
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
      await createTicket({
        code,
        amount: cart.totalCart,
        namePurchase: req.body.name,
        dni: req.body.dni,
        address: `${req.body.address} ${req.body.addressNumber}`,
        products: productsInCart,
        purchaser: req.session.passport.user
      })
      req.session.ticketCode = code
      // Limpiamos el carrito
      await findCartByIdAndUpdate(req.session.cartId, { products: [] })
      // Redirigimos al Ticket
      return res.status(200).redirect('/ticket')
    } catch (error) {
      res.status(500).send(error)
    }
  })

export default purchaseRouter
