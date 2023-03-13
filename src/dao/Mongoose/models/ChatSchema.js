import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
  idUser: {
    type: String,
    index: true,
  },
  user: {
    type: String,
    index: true,
  },
  messaje: String,
  time: String,
  idConnection: String,
});

export const chatModel = model("Chat", ChatSchema);
