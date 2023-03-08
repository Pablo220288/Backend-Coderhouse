import { cartsModel } from "../models/CartsSchema.js";
import { productModel } from "../models/ProductSchema.js";

class CartMongooseManager {
  existCarts = async (id) => {
    let cartsAll = await cartsModel.find();
    return cartsAll.find((cart) => cart.id === id);
  };
  existProduct = async (id) => {
    let productsAll = await productModel.find();
    return productsAll.find((product) => product.id === id);
  };

  findCarts = async () => {
    let carts = await cartsModel.find();
    return carts;
  };
  findCartsById = async (id) => {
    let cart = await this.existCarts(id);
    if (!cart) return "Carrito no Encontrado";
    return cart.products;
  };

  createCarts = async () => {
    await cartsModel.create({ products: [] });
    return "Carrito Creado Correctamente";
  };

  addProductToCart = async (id_cart, id_product) => {
    let cart = await this.existCarts(id_cart);
    if (!cart) return "Carrito no Encontrado";

    let product = await this.existProduct(id_product);
    if (!product) return "Producto no Encontrado";

    let productInCart = cart.products.some(
      (product) => product.id_product === id_product
    );
    if (!productInCart) {
      let addProduct = [{ id_product, quantity: 1 }, ...cart.products];
      await cartsModel.findByIdAndUpdate(id_cart, { products: addProduct });
      return `Producto ${product.title} agregado al Carrito ${id_cart}. Cantidad: 1`;
    } else {
      let indexProduct = cart.products.findIndex(
        (product) => product.id_product === id_product
      );
      cart.products[indexProduct].quantity++;
      let quantityProductInCart = cart.products[indexProduct].quantity;
      await cartsModel.findByIdAndUpdate(id_cart, { products: cart.products });
      return `Producto ${product.title} agregado al Carrito ${id_cart}. Cantidad: ${quantityProductInCart}`;
    }
  };

  deleteCarts = async (id) => {
    let cart = await this.existCarts(id);
    if (!cart) return "Carrito no Encontrado";
    await cartsModel.findByIdAndDelete(id)
    return "Carrito Eliminado Exitosamente";
  }
}

export default CartMongooseManager;
