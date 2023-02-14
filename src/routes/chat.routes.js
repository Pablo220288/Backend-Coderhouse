import { Router } from "express";
import { io } from "../index.js";

const chatRouter = Router();

const massajeChat = [];
chatRouter.get("/", (req, res) => {
  io.on("connection", (socket) => {
    console.log("Nuevo Cliente Conectado", socket.id);
    socket.on("massajeChat", (data) => {
      massajeChat.push(data);
      io.sockets.emit("messajeLogs", massajeChat);
    });
  });

  res.render("chat", {});
});

export default chatRouter;
