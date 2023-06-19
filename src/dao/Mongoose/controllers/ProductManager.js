import { PORT } from '../../../index.js'
import * as productService from '../../../services/productService.js'

class CrudMongoose {
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
    ) {
      return 400
    }
  }

  exist = async id => {
    const products = await productService.findProducts()
    return products.find(prod => prod.id === id)
  }

  category = async () => {
    const categorys = await productService.findProducts({})
    const selectCategory = []
    for (const prodCategory of categorys) {
      selectCategory.push(prodCategory.category)
    }
    const single = new Set(selectCategory)
    const categorySingle = [...single].sort()
    return categorySingle
  }

  findProducts = async data => {
    const category = await this.category()
    if (data) {
      const category =
        data.category === undefined ? {} : { category: data.category }
      const limit = parseInt(data.limit, 10) || 4
      const page = parseInt(data.page, 10) || 1
      const skip = limit * page - limit
      const sort = data.sort || 'asc'
      const filter = await productService.findPaginateProducts(category, {
        limit,
        page,
        skip,
        sort: { price: sort }
      })
      return [
        {
          ...filter,
          prevLink: `http://localhost:${PORT}/products/${page - 1}`,
          nextlink: `http://localhost:${PORT}/products/${page + 1}`,
          category
        }
      ]
    } else {
      const limit = 4
      const page = 1
      const productsAll = await productService.findPaginateProducts(
        {},
        {
          limit,
          page,
          sort: { price: 'asc' }
        }
      )
      return [
        {
          ...productsAll,
          prevLink: `http://localhost:${PORT}/products/${page - 1}`,
          nextlink: `http://localhost:${PORT}/products/${page + 1}`,
          category
        }
      ]
    }
  }

  findProductsById = async id => {
    const product = await this.exist(id)
    if (!product) return 'Producto no Encontrado'
    return product
  }

  findProductsAll = async () => {
    return productService.findProducts()
  }

  createProducts = async (newProduct, user) => {
    // Comprobamos que no falte Ningun dato antes de crear el producto
    if (this.objectKeys(newProduct) === 400) {
      return 'JSON incompleto. Faltan 1 o mas Datos'
    }
    // Le agregamos el Usario que lo creo
    newProduct.owner = [user]
    const nuevo = await productService.createProduct(newProduct)
    return { message: 'Producto Agregado Correctamente', payload: nuevo }
  }

  updateProducts = async (id, owner, updateProduct) => {
    const product = await this.exist(id)
    if (!product) return { message: 'Producto no Encontrado' }
    if (this.objectKeys(updateProduct) === 400) {
      return { message: 'JSON incompleto. Faltan 1 o mas Datos' }
    }
    updateProduct.owner = [owner]
    const productUpdate = await productService.findByIdAndUpdate(
      id,
      updateProduct
    )
    console.log(productUpdate)
    return {
      message: 'Producto Modificado Correctamente',
      payload: productUpdate
    }
  }

  deleteProductsById = async id => {
    const product = await this.exist(id)
    if (!product) return 'Producto no Encontrado'
    const result = await productService.findByIdAndDelete(id)
    return {
      success: `Producto ${result.title} Eliminado`,
      payload: result
    }
  }
}

export default CrudMongoose
