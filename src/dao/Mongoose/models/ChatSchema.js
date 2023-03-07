import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  idUser: String,
  user: String,
  messaje: String,
  time: String,
  idConnection: String,
});

export const chatModel = model("Chat", ChatSchema);
