import { Router } from "express";
import { messajeChat } from "../index.js";
import { usersChat } from "../index.js";

const chatRouter = Router();

chatRouter.get("/", (req, res) => {
  res.render("chat", {
    title: "Chat Websocket",
    messajes: messajeChat,
    users: usersChat,
  });
});

export default chatRouter;
