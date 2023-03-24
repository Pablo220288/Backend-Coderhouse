import { Router } from "express";
import __dirname from "../utils.js";
import express from "express";
import SessionManager from "../dao/Mongoose/controllers/SessionManager.js";

const sessionRouter = Router();
const session = new SessionManager();

sessionRouter
  .use("/", express.static(__dirname + "/public"))
  .get("/", (req, res, next) => {
    session.getSession(req, res, next);
  })
  .post("/login", (req, res, next) => {
    session.testLogin(req, res, next);
  })
  .post("/register", (req, res, next) => {
    session.createUser(req, res, next);
  })
  .get("/logout", (req, res, next) => {
    session.destroySession(req, res, next);
  });

export default sessionRouter;
