import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  email: { type: String, unique: true, index: true },
  rol: { type: String, default: "User", index: true },
  password: { type: String },
  date: { type: Date, default: Date.now },
});

export const userModel = model("User", UserSchema);
