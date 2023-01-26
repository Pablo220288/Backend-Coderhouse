import express from "express";
import ProductManager from "./components/ProductManager.js";

//Creando Server Express
const app = express();
app.use(express.urlencoded({ extended: true }));

//Creamos Manero de Archvos por FileSystem
const productos = new ProductManager();
const books = productos.readProducts();

/* const books = [
  {
    id: 1,
    title: "Orgullo y Prejuicio",
    description: "Romance",
    price: 2500,
    thumbnail: "https://Orgullo-y-prejuicio-jane-austen.jpeg",
    code: "abc120",
    stock: 5,
  },
  {
    id: 2,
    title: "Juego de Sombras",
    description: "Infantil",
    price: 2000,
    thumbnail: "https://juego-de-sombras-herve-tullet.jpeg",
    code: "abc121",
    stock: 3,
  },
  {
    id: 3,
    title: "Billy Summers",
    description: "Suspenso",
    price: 3500,
    thumbnail: "https://billy-summers-stephen-king.jpeg",
    code: "abc122",
    stock: 7,
  },
  {
    id: 4,
    title: "Persuasion",
    description: "Romance",
    price: 2700,
    thumbnail: "https://billy-persuasion-jane-austen.jpeg",
    code: "abc123",
    stock: 10,
  },
  {
    id: 5,
    title: "Emma",
    description: "Romance",
    price: 2300,
    thumbnail: "https://billy-emma-jane-austen.jpeg",
    code: "abc124",
    stock: 4,
  },
  {
    id: 6,
    title: "El Principito",
    description: "Infantil",
    price: 4500,
    thumbnail: "https://el-principito-antoine-de-saint-exupery.jpeg",
    code: "abc125",
    stock: 9,
  },
  {
    id: 7,
    title: "Charlie y la fábrica de chocolate",
    description: "Infantil",
    price: 4500,
    thumbnail: "https://charlie-y-la-fabrica-de-chocolate-de-roald-dahl.jpeg",
    code: "abc126",
    stock: 2,
  },
  {
    id: 8,
    title: "El Resplandor",
    description: "Suspenso",
    price: 5500,
    thumbnail: "https://el-resplandor-stephen-king.jpeg",
    code: "abc127",
    stock: 3,
  },
  {
    id: 9,
    title: "El Cazador de Sueños",
    description: "Suspenso",
    price: 4500,
    thumbnail: "https://el-cazadorcde-suenos-stephen-king.jpeg",
    code: "abc128",
    stock: 5,
  },
  {
    id: 10,
    title: "Carrie",
    description: "Suspenso",
    price: 4800,
    thumbnail: "https://carrie-stephen-king.jpeg",
    code: "abc129",
    stock: 5,
  },
]; */

//Ruta a productos y Query Limit
app.get("/products", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    if (!limit) return res.send(await books);
    let allBooks = await books;
    let bookFilter = allBooks.slice(0, limit);
    res.send(bookFilter);
  } catch (error) {
    console.log(error);
  }
});
app.get("/products/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let allBooks = await books;
    let bookById = allBooks.find((book) => book.id === id);
    if (!bookById)
      return res.send({ error: "El Producto solicitado no existe" });
    res.send(bookById);
  } catch (error) {
    console.log(error);
  }
});

//Creando Servidor 8080
const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log(`Express por Loacal host ${server.address().port}`)
);
server.on("error", (error) => console.log(`Error en servidor ${error}`));
