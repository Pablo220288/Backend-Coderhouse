import { productModel } from '../dao/Mongoose/models/ProductSchema.js'

export const findProducts = async () => {
  return await productModel.find()
}
export const findPaginateProducts = async (category, options) => {
  return await productModel.paginate(category, options)
}
export const createProduct = async newProduct => {
  return await productModel.create(newProduct)
}
export const findByIdAndUpdate = async (id, updateProduct) => {
  return await productModel.findByIdAndUpdate(id, updateProduct)
}
export const findByIdAndDelete = async id => {
  return await productModel.findByIdAndDelete(id)
}
