import CrudMongoose from "../dao/Mongoose/controllers/ProductManager.js";
import __dirname from "../utils.js";
import express  from "express";
import { Router } from "express";

const productsRouter = Router();
const productAll = new CrudMongoose();

productsRouter
  .use('/', express.static(__dirname + '/public'))
  .get("/", async (req, res) => {
    let products = await productAll.findProducts();
    let data = products[0];
    res.render("home", {
      title: "Backend | Express",
      products: data.docs,
      hasPrevPage: data.hasPrevPage,
      prevPage: data.prevPage,
      prevLink: data.prevLink,
      page: data.page,
      hasNextPage: data.hasNextPage,
      nextPage: data.nextPage,
      nextlink: data.nextlink,
    });
  })
  .get("/:page", async (req, res) => {
    let products = await productAll.findProducts(req.params);
    let data = products[0];
    res.contentType(".html").render("home", {
      title: "Backend | Express",
      products: data.docs,
      hasPrevPage: data.hasPrevPage,
      prevPage: data.prevPage,
      prevLink: data.prevLink,
      page: data.page,
      hasNextPage: data.hasNextPage,
      nextPage: data.nextPage,
      nextlink: data.nextlink,
    });
  });

export default productsRouter;
