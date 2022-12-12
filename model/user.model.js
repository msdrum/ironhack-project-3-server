import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    /** nome completo do usuário */
    name: {
      type: String,
      required: true,
    },

    /** identificação interna do usuário, número de matrícula ou registro funcional */
    idNumber: {
      type: String,
      unique: true,
      required: true,
    },

    /** email do usuário */
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },

    /** papéis que o usuário pode ter no sistema */
    role: {
      type: String,
      enum: ["USER", "GESTOR"],
      default: "USER",
    },

    /* id dos recursos que o user possui, somente preenchido quando for Gestor */
    resources: [
      { type: Schema.Types.ObjectId, 
        ref: "Resource" }
      ], 

    // passwordHash: { type: String, required: true },
    // profilePic: { type: String }, //só se tiver tempo
    // confirmEmail: { type: Boolean, default: false },
    
    /* referência aos agendamentos realizados pelo usuário */
    bookings: [
      { type: Schema.Types.ObjectId, ref: "Bookings" },
    ] ,
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);

export default UserModel;
