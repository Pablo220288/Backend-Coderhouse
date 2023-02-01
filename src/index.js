import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/carts.routes.js";

//Archivo ENV
dotenv.config();

//Creando Server Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

//Creando Loacal host 8080
const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log(`Express por Loacal host ${server.address().port}`)
);
server.on("error", (error) => console.log(`Error en servidor ${error}`));
