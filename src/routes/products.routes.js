import CrudMongoose from "../dao/Mongoose/controllers/ProductManager.js";
import __dirname from "../utils.js";
import express from "express";
import { Router } from "express";
import { userModel } from "../dao/Mongoose/models/UserSchema.js";

const productsRouter = Router();
const productAll = new CrudMongoose();

const products = async (options) => {
  let products = await productAll.findProducts(options);
  let data = {
    title: "Backend | Express",
    products: products[0].docs,
    hasPrevPage: products[0].hasPrevPage,
    prevPage: products[0].prevPage,
    prevLink: products[0].prevLink,
    page: products[0].page,
    hasNextPage: products[0].hasNextPage,
    nextPage: products[0].nextPage,
    nextlink: products[0].nextlink,
    category: products[0].category,
  };
  return data;
};

productsRouter
  .use("/", express.static(__dirname + "/public"))
  .get("/", async (req, res) => {
    if (req.session.login) {
      let data = await products();
      let dataUser = await userModel.find({ email: req.session.email });
      res.render("home", {
        ...data,
        nameUser: `${dataUser[0].firstName} ${dataUser[0].lastName}`,
        rol: dataUser[0].rol,
      });
    } else {
      return res.status(200).redirect("/api/session");
    }
  })
  .get("/:page", async (req, res) => {
    let data = await products(req.params);
    let dataUser = await userModel.find({ email: req.session.email });
    res.render("home", {
      ...data,
      nameUser: `${dataUser[0].firstName} ${dataUser[0].lastName}`,
      rol: dataUser[0].rol,
    });
  });

export default productsRouter;
