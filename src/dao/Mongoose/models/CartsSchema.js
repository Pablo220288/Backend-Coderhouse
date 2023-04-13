import { Schema, model } from 'mongoose'

const productInCart = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const CartsSchema = new Schema(
  {
    products: [productInCart]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export const cartsModel = model('Cart', CartsSchema)
