import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as path from "path";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/carts.routes.js";
import socketRouter from "./routes/socket.routes.js";
import chatRouter from "./routes/chat.routes.js";
import { Server } from "socket.io";
import { dateShort } from "./utils.js";
import connectionMongoose from "./connection/mongoose.js";
import productMongooseRouter from "./routes/productMongoose.routes.js";
import cartsMongooseRouter from "./routes/cartsMongoose.routes.js";
import cartSocketRouter from "./routes/cartsSocket.routes.js";
import productsRouter from "./routes/products.routes.js";
import { chatModel } from "./dao/Mongoose/models/ChatSchema.js";
import CrudMongoose from "./dao/Mongoose/controllers/ProductManager.js";
import cookieParser from "cookie-parser";
import session from "express-session";

//Creando Server Express
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
/* app.use(cookieParser())
app.use(session({
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
})) */

//Handlebars
app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowedProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

//Archivos Staticos
app.use("/", express.static(__dirname + "/public"));

//Creando Loacal host 8080
export const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>
  console.log(`Express por Loacal host ${server.address().port}`)
);
server.on("error", (err) => {
  console.log(`Algo salio mal: ${err}`);
});
export const io = new Server(server);

//ChatSocket
let time = dateShort();
//Usuarios Conectados
export let usersChat = [];
//Mensaje de Bienvenida
const greeting = {
  user: "Administrador",
  messaje: "Bienvenido al Chat 👋",
  time,
  idUser: "1234567890",
};
//Funcion para subir mensajes a MongoDB
const addChatMongoose = async (messaje) => {
  await chatModel.create(messaje);
};
io.on("connection", (socket) => {
  console.log(socket.id, "Conectado");
  socket.on("disconnect", () => {
    console.log(socket.id, "Desconectado");
    let user = usersChat.find((user) => user.idUser === socket.id);
    if (user != undefined) {
      //Subimos a MongoDB Mensaje de Desconeccion
      addChatMongoose({
        user: user.user,
        messaje: "se ha desconecto",
        time: dateShort(),
        idUser: socket.id,
        idConnection: "disConnection",
      });
      let userUpload = usersChat.filter((user) => user.idUser != socket.id);
      usersChat = [...userUpload];
      let findChatMongoose = async () => {
        //Si se Desconecto el ultimo Usuario vaciamos el chat
        if (usersChat.length === 0) await chatModel.deleteMany({});
        //
        let allMessajeMongoose = await chatModel.find();
        io.sockets.emit("userChat", usersChat, allMessajeMongoose);
      };
      findChatMongoose();
    }
  });
  socket.on("userChat", (data) => {
    usersChat.push({
      user: data.user,
      idUser: data.id,
    });
    //Mensaje de Coneccion
    let userConecction = {
      user: data.user,
      messaje: data.messaje,
      time: dateShort(),
      idUser: data.id,
      idConnection: "Connection",
    };
    //Subimos el Mensaje a MongoDB
    let chat = async () => {
      let chats = await chatModel.find();
      if (chats.length === 0) {
        //Si el chat esta vacio, es decir que es la primer conneccion, lo envimos junto a un saludo
        await chatModel.create([greeting, userConecction]);
      } else {
        await chatModel.create(userConecction);
      }
      let allMessajeMongoose = await chatModel.find();
      io.sockets.emit("userChat", usersChat, allMessajeMongoose);
    };
    chat();
  });

  socket.on("messajeChat", (data) => {
    //Subimos Mensaje a MongoDB
    addChatMongoose(data);
    let findChatMongoose = async () => {
      let allMessajeMongoose = await chatModel.find();
      io.sockets.emit("messajeLogs", allMessajeMongoose);
    };
    findChatMongoose();
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

//Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/realTimeProducts", socketRouter);
app.use("/chatSocket", chatRouter);
app.use("/mongoose/products", productMongooseRouter);
app.use("/mongoose/carts", cartsMongooseRouter);
app.use("/realTimeCarts", cartSocketRouter);
app.use("/products", productsRouter)

