import { promises as fs } from "fs";
import ProductManager from "./ProductManager.js";
import { nanoid } from "nanoid";

const products = new ProductManager();

class CartsManager {
  constructor() {
    this.path = "./src/models/carts.json";
  }
  readCarts = async () => {
    let allCarts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(allCarts);
  };
  writeCarts = async (cart) => {
    await fs.writeFile(this.path, JSON.stringify(cart), (error) => {
      if (error) throw error;
    });
  };
  exist = async (id) => {
    let cartsAll = await this.readCarts(this.path);
    return cartsAll.find((cart) => cart.id === id);
  };
  deleteCart = async (id) => {
    let carts = await this.readCarts();
    let filterCarts = carts.filter((cart) => cart.id != id);
    await this.writeCarts(filterCarts);
    return filterCarts;
  };
  addCarts = async () => {
    let id = nanoid();
    let cartsOld = await this.readCarts();
    let allCarts = [...cartsOld, { id: id, productos: [] }];
    await this.writeCarts(allCarts);
    return `Carrito Creado Exitosamente.\n Carritos Existentes ${allCarts.length}`;
  };
  getCartById = async (id) => {
    let existCart = await this.exist(id);
    if (!existCart) return 404;
    return existCart.productos;
  };
  addProductInCart = async (cartId, prodId) => {
    //Comprobamos si existe el carrito
    let cartById = await this.exist(cartId);
    if (!cartById) return "error cart";
    //Comprobamos si existe el producto
    let productById = await products.exist(prodId);
    if (!productById) return "error product";
    //Lo Eliminamos el carrito del Array
    const cartsOld = await this.deleteCart(cartId);
    //Cargamos el Producto en el Carrito
    if (
      cartById.productos.some((productInCart) => productInCart.id === prodId)
    ) {
      let addMoreProducts = cartById.productos.find(
        (prod) => prod.id === prodId
      );
      addMoreProducts.quantity++;
      let allCarts = [...cartsOld, cartById];
      await this.writeCarts(allCarts);
      return `Producto "${productById.title}" agregado al carrito: ${cartId}\n Cantidad: ${addMoreProducts.quantity} `;
    }
    cartById.productos.push({ id: productById.id, quantity: 1 });
    //Lo subimos Modificado
    let allCarts = [...cartsOld, cartById];
    await this.writeCarts(allCarts);
    return `Producto "${productById.title}" agregado al carrito: ${cartId}`;
  };
}

export default CartsManager;
