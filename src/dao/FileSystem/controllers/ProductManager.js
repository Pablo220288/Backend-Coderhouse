import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'

class ProductManager {
  constructor () {
    this.path = './src//dao/FileSystem/json/productos.json'
  }

  readProducts = async () => {
    const allProducts = await fs.readFile(this.path, 'utf-8')
    return JSON.parse(allProducts)
  }

  writeProducts = async (productos) => {
    await fs.writeFile(this.path, JSON.stringify(productos), (error) => {
      if (error) throw error
    })
  }

  exist = async (id) => {
    const productsAll = await this.readProducts(this.path)
    return productsAll.find((product) => product.id === id)
  }

  objectKeys (object) {
    if (
      !object.title ||
      !object.author ||
      !object.description ||
      !object.price ||
      !object.status ||
      !object.category ||
      !object.code ||
      !object.stock
    ) { return 400 }
  }

  getProducts = async (limit) => {
    const allBooks = await this.readProducts()
    if (!limit) return allBooks
    const bookFilter = allBooks.slice(0, parseInt(limit))
    return bookFilter
  }

  getProductsById = async (id) => {
    const bookById = await this.exist(id)
    if (!bookById) return 'Producto no Encontrado'
    return bookById
  }

  addProduct = async (newProduct) => {
    // Comprobamos que no falte ningun campo
    if (this.objectKeys(newProduct) === 400) return 'JSON incompleto. Faltan 1 o mas Datos'
    const productsOld = await this.readProducts()
    newProduct.id = nanoid()
    const productsAll = [newProduct, ...productsOld]
    await this.writeProducts(productsAll)
    return 'Producto Agregado Correctamente'
  }

  updateProduct = async (id, product) => {
    // Consultamos si Existe
    const bookById = await this.exist(id)
    if (!bookById) return 'Producto a modificar no Existe'
    // Comprobamos que no falte ningun campo
    if (this.objectKeys(product) === 400) return 'JSON incompleto. Faltan 1 o mas Datos'
    // Eliminamos el Producto a Modificar
    await this.deleteProducts(id)
    // Lo agregamos al Array conservando su ID
    const prod = await this.readProducts()
    const modifiedProducts = [
      {
        ...product,
        id
      },
      ...prod
    ]
    await this.writeProducts(modifiedProducts)
    return `Producto ${product.title} Modificado con Exito`
  }

  deleteProducts = async (id) => {
    // Consultamos si Existe
    const bookById = await this.exist(id)
    if (!bookById) return 'Producto No Encontrado'
    const products = await this.readProducts()
    const filterProducts = products.filter((prod) => prod.id !== id)
    await this.writeProducts(filterProducts)
    return 'Producto Eliminado Exitosamente'
  }
}

export default ProductManager
