import { promises as fs } from "fs";

class ProductManager {
  constructor() {
    this.products = [];
    this.pathProducts = "./json/productos.json";
    this.pathCarts = "./json/carts.json";
  }

  writeProducts = async (path, productos) => {
    await fs.writeFile(path, JSON.stringify(productos), (error) => {
      if (error) throw error;
    });
  };

  readProducts = async (path) => {
    let allProducts = await fs.readFile(path, "utf-8");
    return JSON.parse(allProducts);
  };
  generateId() {
    let d = new Date().getTime();
    let uuid = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  addProduct = async (newProduct) => {
    let productsOld = await this.readProducts(this.pathProducts);
    newProduct.id = this.generateId();
    let productsAll = [...productsOld, newProduct];
    await this.writeProducts(this.pathProducts, productsAll);
  };

  getProducts = async () => {
    let productsAll = await this.readProducts(this.pathProducts);
    console.log(productsAll);
  };

  exist = async (id, path) => {
    let productsAll = await this.readProducts(path);
    return productsAll.find((product) => product.id === id);
  };

  getProductsById = async (id) => {
    (await this.exist(id, productos.pathProducts))
      ? console.log(await this.exist(id))
      : console.log("NOT FOUND");
  };

  updateProduct = async (id, product) => {
    await this.deleteProducts(id,);
    let prod = await this.readProducts(this.pathProducts);
    let modifiedProducts = [
      ...prod,
      {
        ...product,
        id: id,
      },
    ];
    await this.writeProducts(this.pathProducts, modifiedProducts);
  };
  deleteProducts = async (id, path) => {
    let products = await this.readProducts(path);
    let filterProducts = products.filter((prod) => prod.id != id);
    await this.writeProducts(path, filterProducts);
    return filterProducts;
  };
}

export default ProductManager;

//TEST//

//const productos = new ProductManager();

//Agregamos Productos
/* productos.addProduct(
  "Orgullo y Prejuicio",
  "Libro Romance",
  1500,
  true,
  "Romance",
  [
    "https://Orgullo-y-prejuicio-jane-austen-1.jpeg",
    "https://Orgullo-y-prejuicio-jane-austen-2.jpeg",
  ],
  "abc121",
  5
);
productos.addProduct(
  "Juego de Sombras",
  "Libro Infantil",
  2000,
  true,
  "Infantil",
  [
    "https://juego-de-sombras-herve-tullet-1.jpeg",
    "https://juego-de-sombras-herve-tullet-2.jpeg",
  ],
  "abc122",
  3
);
productos.addProduct(
  "Billy Summers",
  "Libro Suspenso",
  3500,
  true,
  "Suspenso",
  [
    "https://billy-summers-stephen-king-1.jpeg",
    "https://billy-summers-stephen-king-2.jpeg",
  ],
  "abc123",
  7
);
productos.addProduct(
  "Persuasion",
  "Libro Romance",
  2700,
  true,
  "Romance",
  [
    "https://billy-persuasion-jane-austen-1.jpeg",
    "https://billy-persuasion-jane-austen-2.jpeg,",
  ],
  "abc124",
  10
);
productos.addProduct(
  "Emma",
  "Libro Romance",
  2300,
  true,
  "Romance",
  [
    "https://billy-emma-jane-austen-1.jpeg",
    "https://billy-emma-jane-austen-2.jpeg",
  ],
  "abc125",
  4
);
productos.addProduct(
  "El Principito",
  "Libro Infantil",
  4500,
  true,
  "Infantil",
  [
    "https://el-principito-antoine-de-saint-exupery-1.jpeg",
    "https://el-principito-antoine-de-saint-exupery-2.jpeg",
  ],
  "abc126",
  9
);
productos.addProduct(
  "Charlie y la fábrica de chocolate",
  "Libro Infantil",
  3800,
  true,
  "Infantil",
  [
    "https://charlie-y-la-fabrica-de-chocolate-de-roald-dahl-1.jpeg",
    "https://charlie-y-la-fabrica-de-chocolate-de-roald-dahl-2.jpeg",
  ],
  "abc127",
  2
);
productos.addProduct(
  "El Resplandor",
  "Libro Suspenso",
  5500,
  true,
  "Suspenso",
  [
    "https://el-resplandor-stephen-king-1.jpeg",
    "https://el-resplandor-stephen-king-2.jpeg",
  ],
  "abc128",
  3
);
productos.addProduct(
  "El Cazador de Sueños",
  "Libro Suspenso",
  4800,
  true,
  "Suspenso",
  [
    "https://el-cazadorcde-suenos-stephen-king-1.jpeg",
    "https://el-cazadorcde-suenos-stephen-king-2.jpeg",
  ],
  "abc129",
  5
);
productos.addProduct(
  "Carrie",
  "Libro Suspenso",
  4700,
  true,
  "Suspenso",
  ["https://carrie-stephen-king-1.jpeg", "https://carrie-stephen-king-2.jpeg"],
  "abc130",
  5
); */

//Consultamos todos los Productos existentes
//productos.getProducts();

//Consultamos un Producto por su ID
//productos.getProductsById(2);

//Actualizamos un Producto existente
/* productos.updateProduct({
  title: "Orgullo y Prejuicio",
  description: "Libro Romance",
  price: 2500,
  thumbnail: "https://Orgullo-y-prejuicio-jane-austen.jpeg",
  code: "abc123",
  stock: 5,
  id: 1,
}); */

//Eliminamos un Producto por su ID
//productos.deleteProducts(2);
