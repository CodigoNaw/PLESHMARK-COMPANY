// models/Empresa.js
import mongoose from "mongoose";

const EmpresaSchema = new mongoose.Schema(
  {
    nombreEmpresa: { type: String, required: true },
    nit: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    tipoEmpresa: { type: String, required: true },
    telefono: { type: String, required: true },
    rol: { type: String, default: "empresa" },
    descripcion: { type: String, default: "" },
    foto: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Empresa || mongoose.model("Empresa", EmpresaSchema);
