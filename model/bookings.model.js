import { Schema, model } from "mongoose";

const bookingsSchema = new Schema({

  /** referência ao usuário logado que fez a reserv */
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  /** referência ao recurso escolhido para ser reservado */
  resource: { 
    type: Schema.Types.ObjectId, 
    ref: "Resource" 
  },

  /** data e horário agendado  
   * pegar a referência correta (Schedule não é um model, precisa pegar o campo schedule do UserModel)
  */
  schedule: { 
    type: String 
  },
  
  /** situação da reserva
   * pendente, quando é aberta e está aguardando aprovação do gestor do recurso
   * reservado, quando gestor aprovou a reserva,
   * cancelado, quando o agendamento não é aprovado ou quando o usuário cancela
   */
  status: {
    type: String,
    enum: ["Pendente", "Reservado", "Cancelado"], //trocar para disponível, indisponível e cancelado
    default: "Pendente",
  },
});

const BookingsModel = model("Bookings", bookingsSchema);

export default BookingsModel;
