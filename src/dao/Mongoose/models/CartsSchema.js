import { Schema, model } from "mongoose";

const productInCart = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
});

const CartsSchema = new Schema({
  products: [productInCart],
});

export const cartsModel = model("Cart", CartsSchema);
