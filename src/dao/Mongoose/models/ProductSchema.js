import { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      require: true,
      index: true
    },
    author: {
      type: String,
      require: true,
      index: true
    },
    description: {
      type: String,
      require: true
    },
    price: {
      type: Number,
      default: 0,
      index: true
    },
    status: {
      type: Boolean,
      default: true
    },
    category: {
      type: String,
      require: true
    },
    thumbnail: String,
    code: {
      type: String,
      unique: true,
      require: true
    },
    stock: {
      type: Number,
      default: 1
    },
    owner: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

ProductSchema.plugin(paginate)
export const productModel = model('Product', ProductSchema)
