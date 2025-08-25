import dbConnect from "@/lib/mongodb";
import Administrador from "@/models/Administrador";
import Usuario from "@/models/Usuario";
import Empresa from "@/models/Empresa";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();
  const { nombre, correo, contraseña, tipoDocumento, numeroDocumento, telefono } = await req.json();

  if (!nombre || !correo || !contraseña || !tipoDocumento || !numeroDocumento || !telefono) {
    return new Response(
      JSON.stringify({ error: "Todos los campos son obligatorios" }),
      { status: 400 }
    );
  }

  // Buscar en todas las colecciones
  const [existeAdmin, existeUsuario, existeEmpresa] = await Promise.all([
    Administrador.findOne({ correo }),
    Usuario.findOne({ correo }),
    Empresa.findOne({ correo }),
  ]);

  if (existeAdmin || existeUsuario || existeEmpresa) {
    return new Response(
      JSON.stringify({ error: "Correo ya registrado en el sistema" }),
      { status: 400 }
    );
  }

  const hash = await bcrypt.hash(contraseña, 10);

  const nuevoAdmin = new Administrador({
    nombre,
    correo,
    contraseña: hash,
    tipoDocumento,
    numeroDocumento,
    telefono
  });

  await nuevoAdmin.save();

  return new Response(
    JSON.stringify({ mensaje: "Registro exitoso" }),
    { status: 201 }
  );
}
