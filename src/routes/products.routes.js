import CrudMongoose from '../dao/Mongoose/controllers/ProductManager.js'
import CartMongooseManager from '../dao/Mongoose/controllers/CartsManager.js'
import __dirname from '../utils.js'
import express, { Router } from 'express'
import { io } from '../index.js'
import UserService from '../services/userService.js'

const productsRouter = Router()
const productAll = new CrudMongoose()
const carts = new CartMongooseManager()
const userService = new UserService()

const products = async options => {
  const products = await productAll.findProducts(options)
  const data = {
    title: 'Backend | Express',
    products: products[0].docs,
    hasPrevPage: products[0].hasPrevPage,
    prevPage: products[0].prevPage,
    prevLink: products[0].prevLink,
    page: products[0].page,
    hasNextPage: products[0].hasNextPage,
    nextPage: products[0].nextPage,
    nextlink: products[0].nextlink,
    category: products[0].category
  }
  return data
}
export const cartProduct = async idCart => {
  const prod = await carts.findCartsById(idCart)
  const productsInCart = []
  for (let i = 0; i < prod.products.length; i++) {
    productsInCart.push({
      id: prod.products[i]._id.id,
      title: prod.products[i]._id.title,
      thumbnail: prod.products[i]._id.thumbnail,
      price: prod.products[i]._id.price,
      totalPrice: prod.products[i].quantity * prod.products[i]._id.price,
      quantity: prod.products[i].quantity
    })
  }
  const totalCart = productsInCart.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalPrice,
    0
  )
  const countCart = productsInCart.reduce(
    (accumulator, currentValue) => accumulator + currentValue.quantity,
    0
  )
  return { productsInCart, totalCart, countCart }
}

productsRouter
  .use('/', express.static(__dirname + '/public'))
  .get('/:page', async (req, res) => {
    if (req.isAuthenticated()) {
      // Cargamos los productos en nuestra vista
      const data = await products(req.params)
      // Confirmamos Login del User
      req.session.login = true
      // Obtenemos los Datos del User y guardamos en Session
      const user = await userService.findByIdUser(req.session.passport.user)
      req.session.nameUser = `${user.firstName} ${user.lastName}`
      req.session.role = user.roles[0].name
      // Comprobamos si tiene productos en el Carrito
      const productsCart = await cartProduct(user.cart._id.toString())
      let emptyCart = false
      if (productsCart.totalCart === 0) emptyCart = true
      // Generamos JWT y lo guardamos en una Cookie
      const token = await userService.createToken(user)
      res.cookie('jwtCookie', token)
      // Renderizamos Vista con los Productos, Datos del User y Productos en Carrito del User si existen
      res.render('home', {
        ...data,
        nameUser: req.session.nameUser,
        rol: req.session.role,
        cartsProducts: productsCart.productsInCart,
        totalCart: productsCart.totalCart,
        emptyCart,
        countCart: productsCart.countCart,
        purchaserCart: `/purchase/${user.cart._id.toString()}`
      })
      io.on('connection', socket => {
        const idCart = user.cart._id.toString()
        socket.on('addProductToCart', async idProduct => {
          const addProduct = await carts.addProductToCart(idCart, idProduct)
          if (addProduct === 'Stock Insuficiente') {
            io.sockets.emit('stockInsufficient')
          } else {
            const products = await cartProduct(idCart)
            io.sockets.emit('addProductToCart', products)
          }
        })
        socket.on('deleteProductToCart', async idProduct => {
          await carts.deleteProductToCart(idCart, idProduct)
          const products = await cartProduct(idCart)
          io.sockets.emit('deleteProductToCart', products)
        })
        socket.on('emptyCart', async () => {
          await carts.emptycart(idCart)
          const products = await cartProduct(idCart)
          io.sockets.emit('emptyCart', products)
        })
        socket.on('purchaserCart', async () => {
          const productInCart = await carts.findCartsById(idCart)
          const productOutOfStock = []
          for (let i = 0; i < productInCart.products.length; i++) {
            const quantityCart = productInCart.products[i].quantity
            const idProduct = productInCart.products[i]._id._id.toString()
            const product = await productAll.findProductsById(idProduct)
            const stockProduct = product.stock
            if (quantityCart > stockProduct) {
              productOutOfStock.push({
                idProduct,
                title: productInCart.products[i]._id.title
              })
            }
          }
          if (!productOutOfStock.length) {
            io.sockets.emit('purchaserCart')
          } else {
            io.sockets.emit('insufficientStock', productOutOfStock)
          }
        })
      })
    } else {
      return res.status(200).redirect('/api/session')
    }
  })

export default productsRouter
