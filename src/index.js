import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/carts.routes.js";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import * as path from "path";
import cors from "cors";
import { Server } from "socket.io";
import ProductManager from "./controllers/ProductManager.js";
const productAll = new ProductManager();

//Archivo ENV
dotenv.config();

//Creando Server Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Creando Loacal host 8080
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>
  console.log(`Express por Loacal host ${server.address().port}`)
);
const io = new Server(server);

//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

//Archivos Staticos
app.use("/static", express.static(__dirname + "/public"));

//Middleware
app.get("/static", async (req, res) => {
  let products = await productAll.readProducts();
  res.render("home", {
    title: "Backend | Express",
    products,
  });
});

app.get("/static/realTimeProducts", async (req, res) => {
  //Websockets
  //Recibimos peticion de coneccion Cliente
  io.on("connection", (socket) => {
    socket.on("messaje", (data) => {
      console.log(data);
      //Mensaje del Servidor
      io.sockets.emit("estado", "Conectado con el Servidor por Sockets");
    });

    //Recivimos peticion de Consultar producto del cliente
    socket.on("getProduct", async (data) => {
      let byIdProducts = await productAll.getProductsById(data);
      if (data === "") {
        io.sockets.emit("getProduct", {
          messaje: "Se consultaron todos los Productos",
          products: await productAll.getProducts(),
        });
      } else if (byIdProducts === "Producto no Encontrado") {
        io.sockets.emit("getProduct", {
          messaje: byIdProducts,
          products: [],
        });
      } else {
        io.sockets.emit("getProduct", {
          messaje: "Consulta Exitosa",
          products: [byIdProducts],
        });
      }
    });

    //Recivimos peticion de Agergar producto del cliente
    socket.on("addProduct", async (data) => {
      let addProduct = await productAll.addProduct(JSON.parse(data));
      io.sockets.emit("addProduct", {
        messaje: addProduct,
        products: await productAll.readProducts(),
      });
    });

    //Recibimos peticion de Actualizar producto
    socket.on("putProduct", async (data) => {
      let updateProduct = await productAll.updateProduct(data.id, JSON.parse(data.info));
      io.sockets.emit("putProduct", {
        messaje: updateProduct,
        products: await productAll.readProducts(),
      });
    });

    //Recibimos peticion de Eliminar producto
    socket.on("deleteProduct", async (data) => {
      let deleteProduct = await productAll.deleteProducts(data);
      io.sockets.emit("deleteProduct", {
        messaje: deleteProduct,
        products: await productAll.readProducts(),
      });
    });
  });

  //Render por defecto
  let products = await productAll.readProducts();
  res.render("realTimeProducts", {
    title: "Express | Websockets",
    products,
  });
});

//Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

//server.on("error", (error) => console.log(`Error en servidor ${error}`));
