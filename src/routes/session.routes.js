import { Router } from "express";
import __dirname from "../utils.js";
import express from "express";
import SessionManager from "../dao/Mongoose/controllers/SessionManager.js";
import passport from "passport";

const sessionRouter = Router();
const session = new SessionManager();

sessionRouter
  .use("/", express.static(__dirname + "/public"))
  .get("/", (req, res, next) => {
    session.getSession(req, res, next);
  })
  .post(
    "/login",
    passport.authenticate("login", {
      successRedirect: "/products",
      failureRedirect: "/api/session",
      passReqToCallback: true,
      failureFlash: true,
    })
  )
  .post(
    "/register",
    passport.authenticate("register", {
      successRedirect: "/api/session",
      failureRedirect: "/api/session",
      passReqToCallback: true,
      failureFlash: true,
    })
  )
  .get(
    "/githubsession",
    passport.authenticate("github", {
      successRedirect: "/products",
      failureRedirect: "/api/session",
      passReqToCallback: true,
      failureFlash: true,
    })
  )
  .get(
    "/facebooksession",
    passport.authenticate("facebook", {
      successRedirect: "/products",
      failureRedirect: "/api/session",
      passReqToCallback: true,
      failureFlash: true,
    })
  )
  .get("/logout", (req, res, next) => {
    session.destroySession(req, res, next);
  })
  .get(
    "/jwt",
    passport.authenticate("jwt", { session: false }, (req, res) => {
      res.status(200).send(req.user);
    })
  );

export default sessionRouter;
