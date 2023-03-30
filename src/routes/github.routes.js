import { Router } from "express";
import passport from "passport";

const githubRouter = Router();

githubRouter
  .get(
    "/github",
    passport.authenticate("github", { scope: ["user: email"] }),
    async (req, res) => {}
  )
  .get("/githubsession", passport.authenticate("github"), async (req, res) => {
    console.log(req.session)
    req.session.user = req.user;
    res.status(200).redirect("/products");
  });

export default githubRouter;
