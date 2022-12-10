import { Schema, model } from "mongoose";

const resourceSchema = new Schema({
  resourceType: { type: String, enum: ["LAB", "INSTRUMENTO"], default: "LAB" },
  name: { type: String },
  assessmentNumber: {
    type: String,
    unique: true,
    required: true,
  },
  gestor: { type: Schema.Types.ObjectId, ref: "User" },
  horariosDisponiveis: [
    { type: String },
  ] /* horários disponíveis para reserva do recurso */,
  horariosAgendados: [
    { type: String },
  ] /* array de horários já agendados naquela data */,
});

const ResourceModel = model("Resource", resourceSchema);

export default ResourceModel;
