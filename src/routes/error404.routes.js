import __dirname from "../utils.js";
import express, { Router } from "express";

const error404Router = Router();

error404Router
  .use("/", express.static(__dirname + "/public"))
  .use("/", (req, res, next) => {
    res.status(404).render("404", {
      title: "404 || Not Found",
      error: "La ruta especificada no existe",
    });
  });

  export default error404Router