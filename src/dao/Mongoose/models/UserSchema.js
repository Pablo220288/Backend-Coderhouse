import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    age: { type: Number },
    email: { type: String, unique: true, index: true },
    rol: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
        default: "User",
        index: true,
      },
    ],
    password: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.static("encryptPassword", async (password) => {
  return bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(parseInt(process.env.salt))
  );
});
UserSchema.static("comparePassword", async (password, receivedPassword) => {
  return bcrypt.compareSync(password, receivedPassword);
});

export default model("User", UserSchema);
