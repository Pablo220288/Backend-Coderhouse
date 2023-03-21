import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
});

export const userModel = model("User", UserSchema);
