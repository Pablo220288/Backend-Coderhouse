import { Router } from "express";
import __dirname from "../utils.js";
import express from "express";
import { io } from "../index.js";
import { userModel } from "../dao/Mongoose/models/UserSchema.js";

const sessionRouter = Router();

sessionRouter
  .use("/", express.static(__dirname + "/public"))
  .get("/", (req, res, next) => {
    res.render("home");
  })
  .get("/login", (req, res, next) => {
    io.on("connection", (socket) => {
      socket.on("login", async (data) => {
        let user = await userModel.findOne({ email: data.email });
        if (user == null) {
          io.sockets.emit("login", {
            messaje: "Email no registrado",
          });
        } else if (data.password === user.password) {
          io.sockets.emit("login", {
            messaje: "Login exitoso",
            link: "/products",
          });
        } else {
          io.sockets.emit("login", {
            messaje: "Password incorrecto",
          });
        }
      });
    });
    return res.render("login", {
      title: "Login | Signup",
      noNav: true,
    });
  });

export default sessionRouter;
