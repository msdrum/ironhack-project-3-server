import { Schema, model } from "mongoose";

const resourceSchema = new Schema({
  /* tipo do recurso, agrupamento */
  resourceType: {
    type: String,
    enum: ["LAB", "INSTRUMENTO", "ESTAÇÃO DE TRABALHO", "SALA"],
    default: "LAB",
  },

  /* nome do recurso, ex. laboratório 1, sala de reuniões, piano 2, etc */
  name: {
    type: String,
  },

  /* número de controle do recurso, p. ex. número de patrimônio ou tombamento*/
  assessmentNumber: {
    type: String,
    unique: true,
    required: true,
  },

  /* id do gestor responsável pelo recurso */
  gestor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  /** horários disponíveis para reserva do recurso, por ex. seg e qua de manhã: 
  {1 08:00}, {1 09:00}, {1 10:00}, {1 11:00},
  {3 08:00}, {3 09:00}, {3 10:00}, {3 11:00}
  sendo que 0= domingo, 1=segunda, 2=terça, 3=quarta, etc..
  {
    "availableBooking": {
        "segunda": [09:00, 10:00],
        "terça-feira": [10:00, 11:00, 12:00],
        "quarta-feira":[],
        "quinta-feira":[],
        "sexta-feira":[],
    },
  */
  availableBooking: [
    //Date?
    { type: String },
  ]},
  {
    timestamps: true,
  }
);

const ResourceModel = model("Resource", resourceSchema);

export default ResourceModel;
