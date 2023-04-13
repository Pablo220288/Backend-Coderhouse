import { productModel } from '../models/ProductSchema.js'
import { PORT } from '../../../index.js'

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
    ) { return 400 }
  }

  exist = async (id) => {
    const products = await productModel.find()
    return products.find((prod) => prod.id === id)
  }

  category = async () => {
    const categorys = await productModel.find({})
    const selectCategory = []
    for (const prodCategory of categorys) {
      selectCategory.push(prodCategory.category)
    }
    const single = new Set(selectCategory)
    const categorySingle = [...single].sort()
    return categorySingle
  }

  findProducts = async (data) => {
    const category = await this.category()
    if (data) {
      const category =
        data.category === undefined ? {} : { category: data.category }
      const limit = parseInt(data.limit, 10) || 4
      const page = parseInt(data.page, 10) || 1
      const skip = limit * page - limit
      const sort = data.sort || 'asc'
      const filter = await productModel.paginate(category, {
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
      const productsAll = await productModel.paginate(
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

  findProductsById = async (id) => {
    const product = await this.exist(id)
    if (!product) return 'Producto no Encontrado'
    return product
  }

  createProducts = async (newProduct) => {
    if (this.objectKeys(newProduct) === 400) { return 'JSON incompleto. Faltan 1 o mas Datos' }
    await productModel.create(newProduct)
    return 'Producto Agregado Correctamente'
  }

  updateProducts = async (id, updateProduct) => {
    const product = await this.exist(id)
    if (!product) return 'Producto no Encontrado'
    if (this.objectKeys(updateProduct) === 400) { return 'JSON incompleto. Faltan 1 o mas Datos' }
    await productModel.findByIdAndUpdate(id, updateProduct)
    return 'Producto Modificado Correctamente'
  }

  deleteProductsById = async (id) => {
    const product = await this.exist(id)
    if (!product) return 'Producto no Encontrado'
    const result = await productModel.findByIdAndDelete(id)
    return `Producto ${result.title} Eliminado`
  }
}

export default CrudMongoose
