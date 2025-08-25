import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();
  const { correo, contraseña } = await req.json();

  const empresa = await Empresa.findOne({ correo });
  if (!empresa) {
    return new Response(JSON.stringify({ error: "Empresa no encontrada" }), { status: 400 });
  }

  const coincide = await bcrypt.compare(contraseña, empresa.contraseña);
  if (!coincide) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), { status: 400 });
  }

  const token = jwt.sign(
    {
      id: empresa._id,
      rol: empresa.rol, 
      nombreEmpresa: empresa.nombreEmpresa,
      nit: empresa.nit,
      direccion: empresa.direccion,
      correo: empresa.correo,
      tipoEmpresa: empresa.tipoEmpresa,
      telefono: empresa.telefono
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return new Response(JSON.stringify({ token }), { status: 200 });
}