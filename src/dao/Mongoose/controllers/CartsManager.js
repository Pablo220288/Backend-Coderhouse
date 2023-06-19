import { findProducts } from '../../../services/productService.js'
import * as cartService from '../../../services/cartService.js'

class CartMongooseManager {
  existCarts = async id => {
    const cartsAll = await cartService.findCarts()
    return cartsAll.find(cart => cart.id === id)
  }

  existProduct = async id => {
    const productsAll = await findProducts()
    return productsAll.find(product => product.id === id)
  }

  findCarts = async () => {
    const carts = await cartService.findCarts()
    return carts
  }

  findCartsById = async id => {
    const cart = await this.existCarts(id)
    if (!cart) return { status: 'error', message: 'Carrito no Encontrado' }
    const cartById = await cartService.findCartsById(id)
    return { message: 'Carrito Consultado con Exito', payload: cartById }
  }

  createCarts = async () => {
    const newCart = await cartService.createCart()
    return { message: 'Carrito Creado Correctamente', payload: newCart }
  }

  addProductToCart = async (idCart, idProduct) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'Carrito no Encontrado'

    const product = await this.existProduct(idProduct)
    if (!product) return 'Producto no Encontrado'

    const productInCart = cart.products.some(
      product => product.id === idProduct
    )
    if (!productInCart) {
      const addProduct = [{ _id: product.id, quantity: 1 }, ...cart.products]
      await cartService.findCartByIdAndUpdate(idCart, { products: addProduct })
      return `Producto ${product.title} agregado al Carrito. Cantidad: 1`
    } else {
      const indexProduct = cart.products.findIndex(
        product => product.id === idProduct
      )
      if (cart.products[indexProduct].quantity === product.stock) {
        return 'Stock Insuficiente'
      } else {
        cart.products[indexProduct].quantity++
        const quantityProductInCart = cart.products[indexProduct].quantity
        await cartService.findCartByIdAndUpdate(idCart, {
          products: cart.products
        })
        return `Producto ${product.title} agregado al Carrito. Cantidad: ${quantityProductInCart}`
      }
    }
  }

  updateProductToCart = async (idCart, idProduct, newQuantity) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'Carrito no Encontrado'

    const productInCart = cart.products.some(
      product => product.id === idProduct
    )
    if (!productInCart) {
      return 'Producto no Encontrado'
    } else {
      const indexProduct = cart.products.findIndex(
        product => product.id === idProduct
      )
      cart.products[indexProduct].quantity = newQuantity
      await cartService.findCartByIdAndUpdate(idCart, {
        products: cart.products
      })
      return `Producto actualizado. Cantidad: ${newQuantity}`
    }
  }

  deleteCarts = async id => {
    const cart = await this.existCarts(id)
    if (!cart) return { status: 'error', message: 'Carrito no Encontrado' }
    const deleteCart = await cartService.findCartByIdAndDelete(id)
    return { message: 'Carrito Eliminado Exitosamente', payload: deleteCart }
  }

  deleteProductToCart = async (idCart, idProduct) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'Carrito no Encontrado'

    const productInCart = cart.products.some(
      product => product.id === idProduct
    )
    if (!productInCart) {
      return 'Producto no Encontrado'
    } else {
      const productsUpdate = cart.products.filter(
        product => product.id !== idProduct
      )
      await cartService.findCartByIdAndUpdate(idCart, {
        products: productsUpdate
      })
      return 'Producto eliminado del Carrito.'
    }
  }

  emptycart = async id => {
    const cart = await this.existCarts(id)
    if (!cart) return 'Carrito no Encontrado'
    await cartService.findCartByIdAndUpdate(id, { products: [] })
    return 'Carrito Vaciado Exitosamente'
  }
}

export default CartMongooseManager
