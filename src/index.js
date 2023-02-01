import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/carts.routes.js";
import __dirname from "../utils.js";
import hbs from "hbs";

//Archivo ENV
dotenv.config();

//Creando Server Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

//Archivos Staticos
hbs.registerPartials(__dirname + "/views", (err) => {});
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//Creando Loacal host 8080
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>
  console.log(`Express por Loacal host ${server.address().port}`)
);
server.on("error", (error) => console.log(`Error en servidor ${error}`));
