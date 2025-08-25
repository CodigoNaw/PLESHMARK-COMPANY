import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    correo: { type: String, unique: true, required: true },
    contraseña: { type: String, required: true },
    tipoDocumento: { type: String },
    numeroDocumento: { type: String },
    telefono: { type: String },
    direccion: { type: String },

    // 🔹 Nuevo campo: especialidad
    especialidad: { type: String, default: "" },

    // 🔹 Nuevo campo: currículum en PDF
    pdfCurriculum: { type: String, default: "" }, // ⬅️ URL del PDF en Cloudinary
    // 🔹 Otros campos
    rol: { type: String, default: "usuario" },
    foto: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);
