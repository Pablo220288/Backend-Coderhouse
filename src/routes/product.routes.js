import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const productRouter = Router();

//Creamos Manero de Archvos por FileSystem
const productos = new ProductManager();

//Ruta a todos los Productos y Query Limit
productRouter.get("/", async (req, res) => {
  try {
    res.send(await productos.getProducts(req.query.limit));
  } catch (error) {
    console.log(error);
  }
});
//Ruta a Producto por ID
productRouter.get("/:id", async (req, res) => {
  try {
    let productById = await productos.getProductsById(req.params.id);
    if (productById === "Producto no Encontrado")
      return res.status(404).render("error", {
        title: "404 || Not Found",
        image: "/static/img/404.gif",
        error: "El producto que buscas no existe",
      });
    return res.send(productById);
  } catch (error) {
    console.log(error);
  }
});
//Ruta para agregar Producto
productRouter.post("/", async (req, res) => {
  let addProduct = await productos.addProduct(req.body);
  if (addProduct === "JSON incompleto. Faltan 1 o mas Datos")
    return res.status(400).render("error", {
      title: "400 || Bad Request",
      image: "/static/img/404.gif",
      error: "Faltan Datos",
    });
  return res.send(addProduct);
});
//Ruta para Modificar Producto por ID
productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const modify = req.body;
  let modifyProduct = await productos.updateProduct(id, modify);
  if (modifyProduct === "Producto a modificar no Existe")
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/static/img/404.gif",
      error: "El producto a Modificar no existe",
    });
  if (modifyProduct === "JSON incompleto. Faltan 1 o mas Datos")
    return res.status(400).render("error", {
      title: "400 || Bad Request",
      image: "/static/img/404.gif",
      error: "Faltan Datos",
    });
  return res.send(modifyProduct);
});
//Ruta para eliminar Producto por si ID
productRouter.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let productDelete = await productos.deleteProducts(id);
  if (productDelete === "Producto No Encontrado")
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/static/img/404.gif",
      error: "El Producto a Eliminar no Existe",
    });
  res.send(productDelete);
});

export default productRouter;
