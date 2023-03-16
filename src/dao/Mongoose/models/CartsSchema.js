import { Schema, model } from "mongoose";

const productInCart = new Schema({
  id_product: {
    type: String,
    index: true,
  },
  quantity: Number,
});

const CartsSchema = new Schema({
  products: [{ type: Schema.Types.ObjectId, ref: "productModel" }],
});

export const cartsModel = model("Cart", CartsSchema);
