import { Schema, model } from "mongoose";

const bookingsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  resource: { type: Schema.Types.ObjectId, ref: "Resource" },
  schedule: { type: Schema.Types.ObjectId, ref: "Schedule" }, // pegar a referência correta (Schedule não é um model, precisa pegar o campo schedule do UserModel)
  status: {
    type: String,
    enum: ["Pendente", "Ativo", "Cancelado"],
    default: "Pendente",
  },
});

const BookingsModel = model("Bookings", bookingsSchema);
