import express from "express";
import ProductManager from "../js/fs.js";

const app = express();
app.use(express.urlencoded({ extended: true }));

const productos = new ProductManager();
const books = productos.getProducts()

console.log(books)


/* const books = [
  {
    id: "1",
    title: "Orgullo y Prejuicio",
    description: "Libro Romance",
    price: 1500,
    thumbnail: "https://Orgullo-y-prejuicio-jane-austen.jpeg",
    code: "abc123",
    stock: 5,
  },
  {
    id: "2",
    title: "Juego de Sombras",
    description: "Libro Infantil",
    price: 2000,
    thumbnail: "https://juego-de-sombras-herve-tullet.jpeg",
    code: "abc124",
    stock: 3,
  },
  {
    id: "3",
    title: "Billy Summers",
    description: "Libro Suspenso",
    price: 3500,
    thumbnail: "https://billy-summers-stephen-king.jpeg",
    code: "abc125",
    stock: 7,
  },
]; */

app.get("/products", async (req, res) => {
  try {
    let id = req.query.id;
    if (!id) return res.send({ books });
    let bookFilter = books.find((book) => book.id === id);
    res.send({ bookFilter });
  } catch (error) {
    console.log(error);
  }
});

app.listen(8080, () => console.log("Loacal host 8080 por Express"));
