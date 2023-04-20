import { cartsModel } from '../dao/Mongoose/models/CartsSchema.js'

export const findCarts = async () => {
  return await cartsModel.find()
}
export const findCartsById = async id => {
  return await cartsModel.findById(id).populate('products._id')
}
export const createCart = async () => {
  return await cartsModel.create({ products: [] })
}
export const findCartByIdAndUpdate = async (id, product) => {
  return await cartsModel.findByIdAndUpdate(id, product)
}
export const findCartByIdAndDelete = async id => {
  return await cartsModel.findByIdAndDelete(id)
}
