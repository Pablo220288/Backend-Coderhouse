import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  title: {
    type: String,
    unique: true,
    require: true,
    index: true,
  },
  author: {
    type: String,
    require: true,
    index: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    require: true,
  },
  thumbnail: String,
  code: {
    type: String,
    unique: true,
    require: true,
  },
  stock: {
    type: Number,
    default: 1,
  },
});

export const productModel = model("Product", ProductSchema);
