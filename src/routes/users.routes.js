import { Router } from "express";
import { userModel } from "../dao/Mongoose/models/UserSchema.js";

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  let users = await userModel.find({});
  return res.status(200).send(users);
});

export default usersRouter;
