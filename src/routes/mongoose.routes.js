import { Router } from "express";
import CrudMongoose from "../controllers/CrudMongoose.js";

const mongooseRouter = Router();
const productsByMongoose = new CrudMongoose();

mongooseRouter.get("/", async (req, res) => {
  try {
    res.status(200).send(await productsByMongoose.findProducts());
  } catch (err) {
    res.status(404).send("Error en la consulta", err);
  }
});
mongooseRouter.get("/:id", async (req, res) => {
  try {
    res.status(200).send(await productsByMongoose.findProductsById(req.params.id));
  } catch (err) {
    res.status(404).send("Producto no encontrado", err);
  }
});
mongooseRouter.post("/", async (req, res) => {
  try {
    res.status(200).send(await productsByMongoose.createProducts(req.body));
  } catch (err) {
    res.status(400).send("Error de sintaxis", err);
  }
});
mongooseRouter.delete("/:id", async (req, res) => {
  console.log(req.params.id)
  try {
    res.status(200).send(await productsByMongoose.deleteProductsById(req.params.id));
  } catch (err) {
    res.status(400).send("Error de sintaxis", err);
  }
});

export default mongooseRouter;
