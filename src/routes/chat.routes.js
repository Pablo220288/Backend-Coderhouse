import { Router } from "express";
import { date } from "../utils.js";
import { usersChat } from "../index.js";

const chatRouter = Router();

chatRouter.get("/", (req, res) => {
  let time = date();
  res.render("chat", {
    title: "Chat Websocket",
    messajes:   {
      user: "Administrador",
      messaje: "Bienvenido al Chat 👋",
      time,
    },
    users: usersChat,
  });
});

export default chatRouter;
