import dbConnect from "@/lib/mongodb";
import Usuario from "@/models/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();
  const { correo, contraseña } = await req.json();

  const usuario = await Usuario.findOne({ correo });
  if (!usuario) {
    return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 400 });
  }

  const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!coincide) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), { status: 400 });
  }

const token = jwt.sign(
  {
    id: usuario._id,
    nombre: usuario.nombre,
    rol: usuario.rol,
    correo: usuario.correo,
    tipoDocumento: usuario.tipoDocumento,
    numeroDocumento: usuario.numeroDocumento,
    telefono: usuario.telefono
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

return new Response(JSON.stringify({ token }), { status: 200 });
}
