import { cartsModel } from '../models/CartsSchema.js'
import { productModel } from '../models/ProductSchema.js'

class CartMongooseManager {
  existCarts = async (id) => {
    const cartsAll = await cartsModel.find()
    return cartsAll.find((cart) => cart.id === id)
  }

  existProduct = async (id) => {
    const productsAll = await productModel.find()
    return productsAll.find((product) => product.id === id)
  }

  findCarts = async () => {
    const carts = await cartsModel.find()
    return carts
  }

  findCartsById = async (id) => {
    const cart = await this.existCarts(id)
    if (!cart) return 'Carrito no Encontrado'
    return await cartsModel.findById(id).populate('products._id')
  }

  createCarts = async () => {
    await cartsModel.create({ products: [] })
    return 'Carrito Creado Correctamente'
  }

  addProductToCart = async (idCart, idProduct) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'Carrito no Encontrado'

    const product = await this.existProduct(idProduct)
    if (!product) return 'Producto no Encontrado'

    const productInCart = cart.products.some(
      (product) => product.id === idProduct
    )
    if (!productInCart) {
      const addProduct = [{ _id: product.id, quantity: 1 }, ...cart.products]
      await cartsModel.findByIdAndUpdate(idCart, { products: addProduct })
      return `Producto ${product.title} agregado al Carrito. Cantidad: 1`
    } else {
      const indexProduct = cart.products.findIndex(
        (product) => product.id === idProduct
      )
      cart.products[indexProduct].quantity++
      const quantityProductInCart = cart.products[indexProduct].quantity
      await cartsModel.findByIdAndUpdate(idCart, { products: cart.products })
      return `Producto ${product.title} agregado al Carrito. Cantidad: ${quantityProductInCart}`
    }
  }

  updateProductToCart = async (idCart, idProduct, newQuantity) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'Carrito no Encontrado'

    const productInCart = cart.products.some(
      (product) => product.id === idProduct
    )
    if (!productInCart) {
      return 'Producto no Encontrado'
    } else {
      const indexProduct = cart.products.findIndex(
        (product) => product.id === idProduct
      )
      cart.products[indexProduct].quantity = newQuantity
      await cartsModel.findByIdAndUpdate(idCart, { products: cart.products })
      return `Producto actualizado. Cantidad: ${newQuantity}`
    }
  }

  deleteCarts = async (id) => {
    const cart = await this.existCarts(id)
    if (!cart) return 'Carrito no Encontrado'
    await cartsModel.findByIdAndDelete(id)
    return 'Carrito Eliminado Exitosamente'
  }

  deleteProductToCart = async (idCart, idProduct) => {
    const cart = await this.existCarts(idCart)
    if (!cart) return 'Carrito no Encontrado'

    const productInCart = cart.products.some(
      (product) => product.id === idProduct
    )
    if (!productInCart) {
      return 'Producto no Encontrado'
    } else {
      const productsUpdate = cart.products.filter(
        (product) => product.id !== idProduct
      )
      await cartsModel.findByIdAndUpdate(idCart, { products: productsUpdate })
      return 'Producto eliminado del Carrito.'
    }
  }

  emptycart = async (id) => {
    const cart = await this.existCarts(id)
    if (!cart) return 'Carrito no Encontrado'
    await cartsModel.findByIdAndUpdate(id, { products: [] })
    return 'Carrito Vaciado Exitosamente'
  }
}

export default CartMongooseManager
