import { Router } from "express";
import { dateShort } from "../utils.js";
import { usersChat } from "../index.js";
import { chatModel } from "../dao/Mongoose/models/ChatSchema.js";

const chatRouter = Router();

chatRouter
  .get("/", (req, res) => {
    let time = dateShort();
    res.render("chat", {
      title: "Chat Websocket",
      messajes: {
        user: "Administrador",
        messaje: "Bienvenido al Chat 👋",
        time,
      },
      users: usersChat,
    });
  })
  .get("/messaje", async (req, res) => {
    res.send(await chatModel.find());
  });

export default chatRouter;
