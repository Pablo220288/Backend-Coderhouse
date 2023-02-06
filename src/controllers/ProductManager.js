import { promises as fs } from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.path = "./src/models/productos.json";
  }
  readProducts = async () => {
    let allProducts = await fs.readFile(this.path, "utf-8");
    return JSON.parse(allProducts);
  };
  writeProducts = async (productos) => {
    await fs.writeFile(this.path, JSON.stringify(productos), (error) => {
      if (error) throw error;
    });
  };
  exist = async (id) => {
    let productsAll = await this.readProducts(this.path);
    return productsAll.find((product) => product.id === id);
  };
  objectKeys(object) {
    if (
      !object.title ||
      !object.description ||
      !object.price ||
      !object.status ||
      !object.category ||
      !object.code ||
      !object.stock
    )
      return 400;
  }
  getProducts = async (limit) => {
    let allBooks = await this.readProducts();
    if (!limit) return allBooks;
    let bookFilter = allBooks.slice(0, parseInt(limit));
    return bookFilter;
  };
  getProductsById = async (id) => {
    let bookById = await this.exist(id);
    if (!bookById) return 404;
    return bookById;
  };
  addProduct = async (newProduct) => {
    //Comprobamos que no falte ningun campo
    if (this.objectKeys(newProduct) === 400) return 400;
    let productsOld = await this.readProducts();
    newProduct.id = nanoid();
    let productsAll = [...productsOld, newProduct];
    await this.writeProducts(productsAll);
    return "Producto Agregado Correctamente";
  };
  updateProduct = async (id, product) => {
    //Consultamos si Existe
    let bookById = await this.exist(id);
    if (!bookById) return 404;
    //Comprobamos que no falte ningun campo
    if (this.objectKeys(product) === 400) return 400;
    //Eliminamos el Producto a Modificar
    await this.deleteProducts(id);
    //Lo agregamos al Array conservando su ID
    let prod = await this.readProducts();
    let modifiedProducts = [
      ...prod,
      {
        ...product,
        id: id,
      },
    ];
    await this.writeProducts(modifiedProducts);
    return `Producto ${product.title} Modificado con Exito`;
  };
  deleteProducts = async (id) => {
    //Consultamos si Existe
    let bookById = await this.exist(id);
    if (!bookById) return 404;
    let products = await this.readProducts();
    let filterProducts = products.filter((prod) => prod.id != id);
    await this.writeProducts(filterProducts);
    return "Producto Eliminado Exitosamente";
  };
}

export default ProductManager;
