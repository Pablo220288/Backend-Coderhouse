import { promises as fs } from 'fs'
import ProductManager from './ProductManager.js'
import { nanoid } from 'nanoid'

const products = new ProductManager()

class CartsManager {
  constructor () {
    this.path = './src/dao/FileSystem/json.carts.json'
  }

  readCarts = async () => {
    const allCarts = await fs.readFile(this.path, 'utf-8')
    return JSON.parse(allCarts)
  }

  writeCarts = async (cart) => {
    await fs.writeFile(this.path, JSON.stringify(cart), (error) => {
      if (error) throw error
    })
  }

  exist = async (id) => {
    const cartsAll = await this.readCarts(this.path)
    return cartsAll.find((cart) => cart.id === id)
  }

  deleteCart = async (id) => {
    const carts = await this.readCarts()
    const filterCarts = carts.filter((cart) => cart.id !== id)
    await this.writeCarts(filterCarts)
    return filterCarts
  }

  addCarts = async () => {
    const id = nanoid()
    const cartsOld = await this.readCarts()
    const allCarts = [...cartsOld, { id, productos: [] }]
    await this.writeCarts(allCarts)
    return `Carrito Creado Exitosamente.\n Carritos Existentes ${allCarts.length}`
  }

  getCartById = async (id) => {
    const existCart = await this.exist(id)
    if (!existCart) return 404
    return existCart.productos
  }

  addProductInCart = async (cartId, prodId) => {
    // Comprobamos si existe el carrito
    const cartById = await this.exist(cartId)
    if (!cartById) return 'error cart'
    // Comprobamos si existe el producto
    const productById = await products.exist(prodId)
    if (!productById) return 'error product'
    // Lo Eliminamos el carrito del Array
    const cartsOld = await this.deleteCart(cartId)
    // Cargamos el Producto en el Carrito
    if (
      cartById.productos.some((productInCart) => productInCart.id === prodId)
    ) {
      const addMoreProducts = cartById.productos.find(
        (prod) => prod.id === prodId
      )
      addMoreProducts.quantity++
      const allCarts = [...cartsOld, cartById]
      await this.writeCarts(allCarts)
      return `Producto "${productById.title}" agregado al carrito: ${cartId}\n Cantidad: ${addMoreProducts.quantity} `
    }
    cartById.productos.push({ id: productById.id, quantity: 1 })
    // Lo subimos Modificado
    const allCarts = [...cartsOld, cartById]
    await this.writeCarts(allCarts)
    return `Producto "${productById.title}" agregado al carrito: ${cartId}`
  }
}

export default CartsManager
