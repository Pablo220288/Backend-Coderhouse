import { Schema, model } from "mongoose";

const RoleSchema = new Schema(
  {
    name: { type: String, default: "User" },
    description: { type: String },
    permissions: { type: String },
  },
  {
    versionKey: false,
  }
);

export const roleModel = model("Role", RoleSchema);
