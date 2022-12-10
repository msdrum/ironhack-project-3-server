import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    idNumber: {
      //matrícula
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    role: {
      type: String,
      enum: ["USER", "GESTOR"],
      default: "USER",
    },
    resources: [{ type: Schema.Types.ObjectId, ref: "Resource" }], //apenas gestor
    passwordHash: { type: String, required: true },
    profilePic: { type: String }, //só se tiver tempo
    confirmEmail: { type: Boolean, default: false },
    schedule: [
      { type: Schema.Types.ObjectId, ref: "Resource" },
    ] /* pegar apenas o horário agendado */,
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);

export default UserModel;
