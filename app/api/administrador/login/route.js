import dbConnect from "@/lib/mongodb";
import Administrador from "@/models/Administrador";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();
  const { correo, contraseña } = await req.json();

  const admin = await Administrador.findOne({ correo });
  if (!admin) {
    return new Response(JSON.stringify({ error: "Administrador no encontrado" }), { status: 400 });
  }

  const coincide = await bcrypt.compare(contraseña, admin.contraseña);
  if (!coincide) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), { status: 400 });
  }

  // 🔑 Crear token con datos básicos
  const token = jwt.sign(
    {
      id: admin._id,
      nombre: admin.nombre,
      rol: admin.rol,
      correo: admin.correo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 📦 Preparar datos del admin (sin contraseña)
  const adminData = {
    id: admin._id,
    nombre: admin.nombre,
    rol: admin.rol,
    correo: admin.correo,
    tipoDocumento: admin.tipoDocumento,
    numeroDocumento: admin.numeroDocumento,
    telefono: admin.telefono,
    foto: admin.foto || null,
  };

  return new Response(JSON.stringify({ token, user: adminData }), { status: 200 });
}
