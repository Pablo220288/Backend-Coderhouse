import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/carts.routes.js";
import socketRouter from "./routes/socket.routes.js";
import chatRouter from "./routes/chat.routes.js";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import * as path from "path";
import cors from "cors";
import { Server } from "socket.io";
import ProductManager from "./controllers/ProductManager.js";

//Archivo ENV
dotenv.config();

//Creando Server Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

//Archivos Staticos
app.use("/", express.static(__dirname + "/public"));

//Creando Loacal host 8080
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>
  console.log(`Express por Loacal host ${server.address().port}`)
);
server.on("error", (err) => {
  console.log(`Algo salio mal: ${err}`);
});
export const io = new Server(server);

const date = () => {
  let timeNow = new Date();
  return timeNow.getHours() + ":" + timeNow.getMinutes();
};

//Middleware
let time = date();
export const messajeChat = [
  {
    user: "Administrador",
    messaje: "Bienvenido al Chat 👋",
    time,
    id: "1234567890",
  },
];
export let usersChat = [];
io.on("connection", (socket) => {
  console.log(socket.id, "Conectado");
  socket.on("disconnect", () => {
    console.log(socket.id, "Desconectado");
    let time = date();
    let user = usersChat.find((user) => user.id === socket.id);
    if (user != undefined) {
      messajeChat.push({
        user: user.user,
        messaje: "se desconecto",
        time,
        id: socket.id,
        idConnection: "disConnection",
      });
      let userUpload = usersChat.filter((user) => user.id != socket.id);
      usersChat = [...userUpload]
      io.sockets.emit("userChat", usersChat, messajeChat);
    }
  });

  socket.on("userChat", (data) => {
    usersChat.push({
      user: data.user,
      id: data.id,
    });
    messajeChat.push({
      user: data.user,
      messaje: data.messaje,
      time: data.time,
      id: data.id,
      idConnection: "Connection",
    });
    io.sockets.emit("userChat", usersChat, messajeChat);
  });

  socket.on("messajeChat", (data) => {
    messajeChat.push(data);
    io.sockets.emit("messajeLogs", messajeChat);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

const productAll = new ProductManager();
app.get("/", async (req, res) => {
  let products = await productAll.readProducts();
  res.render("home", {
    title: "Backend | Express",
    products,
  });
});

//Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/realTimeProducts", socketRouter);
app.use("/chatSocket", chatRouter);
