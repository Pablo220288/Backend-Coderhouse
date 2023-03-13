import { Router } from "express";
import CartMongooseManager from "../dao/Mongoose/controllers/CartsManager.js";

const cartsMongooseRouter = Router();
const cartsByMongoose = new CartMongooseManager();

cartsMongooseRouter.get("/", async (req, res) => {
  try {
    res.status(200).send(await cartsByMongoose.findCarts());
  } catch (err) {
    res.status(404).send("Error en la consulta", err);
  }
});
cartsMongooseRouter.get("/:id", async (req, res) => {
  try {
    res.status(200).send(await cartsByMongoose.findCartsById(req.params.id));
  } catch (err) {
    res.status(404).send("Error en la consulta", err);
  }
});
cartsMongooseRouter.post("/", async (req, res) => {
  try {
    res.status(200).send(await cartsByMongoose.createCarts());
  } catch (err) {
    res.status(404).send("Error al crear", err);
  }
});
cartsMongooseRouter.post("/:idc/product/:idp", async (req, res) => {
  try {
    res
      .status(200)
      .send(
        await cartsByMongoose.addProductToCart(req.params.idc, req.params.idp)
      );
  } catch (err) {
    res.status(404).send("Error al agregar", err);
  }
});
cartsMongooseRouter.delete("/:id", async (req, res) => {
  try {
    res.status(200).send(await cartsByMongoose.deleteCarts(req.params.id));
  } catch (err) {
    res.status(404).send("Error al eliminar", err);
  }
});

export default cartsMongooseRouter;
