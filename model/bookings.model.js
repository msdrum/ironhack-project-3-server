import { Schema, model } from "mongoose";

const bookingsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  resource: { type: Schema.Types.ObjectId, ref: "Resource" },
  schedule: { type: String }, // pegar a referência correta (Schedule não é um model, precisa pegar o campo schedule do UserModel)
  status: {
    type: String,
    enum: ["Pendente", "Ativo", "Cancelado"], //trocar para disponível, indisponível e cancelado
    default: "Pendente",
  },
});

const BookingsModel = model("Bookings", bookingsSchema);

export default BookingsModel;
