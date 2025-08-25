import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  contraseña: String,
  tipoDocumento: String,
  numeroDocumento: String,
  telefono: String,
  rol: { type: String, default: "admin" },
  foto: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.Administrador || mongoose.model("Administrador", AdminSchema);
