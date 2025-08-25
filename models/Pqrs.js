import mongoose from "mongoose";

const PqrsSchema = new mongoose.Schema(
  {
    usuarioId: { type: mongoose.Schema.Types.ObjectId, required: true }, // id del usuario/empresa
    rol: { type: String, enum: ["usuario", "empresa"], required: true },
    correo: { type: String, required: true },
    motivo: { type: String, required: true },
    tipo: { 
      type: String, 
      enum: ["peticion", "queja", "reclamo", "sugerencia"], 
      required: true 
    },
    descripcion: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    estado: { type: String, enum: ["pendiente", "respondido"], default: "pendiente" },
    respuesta: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Pqrs || mongoose.model("Pqrs", PqrsSchema);
