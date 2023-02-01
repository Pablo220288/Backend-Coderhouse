import { Router } from "express";
import ProductManager from "../components/ProductManager.js";

const productRouter = Router();

//Creamos Manero de Archvos por FileSystem
const productos = new ProductManager();
const books = productos.readProducts(productos.pathProducts);

//Ruta a todos los Productos y Query Limit
productRouter.get("/", async (req, res) => {
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
//Ruta a Producto por ID
productRouter.get("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let bookById = await productos.exist(id, productos.pathProducts);
    if (!bookById)
      return res
        .status(404)
        .send({ error: "El Producto solicitado no existe" });
    res.send(bookById);
  } catch (error) {
    console.log(error);
  }
});
//Ruta para agregar Producto
productRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  if (
    !newProduct.title ||
    !newProduct.description ||
    !newProduct.price ||
    !newProduct.status ||
    !newProduct.category ||
    !newProduct.code ||
    !newProduct.stock
  )
    return res
      .status(400)
      .send(
        "Faltan Datos!! Se espera :\n {title,\n description,\n price,\n status,\n category,\n thumbnail,\n code,\n stock}"
      );
  await productos.addProduct(newProduct);
  res.send("Producto Agregado");
});
//Ruta para Modificar Producto por ID
productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  let bookById = await productos.exist(id, productos.pathProducts);
  if (!bookById)
    return res.status(404).send({ error: "El Producto a modificar no existe" });
  const modifiedProduct = req.body;
  await productos.updateProduct(id, modifiedProduct);
  res.send("Producto Midificado con Exito");
});
//Ruta para eliminar Producto por si ID
productRouter.delete("/:id", async (req, res) => {
  let id = req.params;
  let bookById = await productos.exist(id, productos.pathProducts);
  if (!bookById)
    return res.status(404).send({ error: "El Producto a eliminar no existe" });
  await productos.deleteProducts(id, productos.pathProducts);
  res.send("Producto eliminado");
});

export default productRouter;
