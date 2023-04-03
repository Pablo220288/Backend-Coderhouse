import { Schema, model } from "mongoose";

const RoleSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    permissiond: { type: String },
  },
  {
    versionKey: false,
  }
);

export const roleModel = model("Role", RoleSchema);
