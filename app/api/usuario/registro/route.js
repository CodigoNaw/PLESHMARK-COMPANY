import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";
import Administrador from "@/models/Administrador";
import Usuario from "@/models/Usuario";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { nombre, correo, contraseña, tipoDocumento, numeroDocumento, telefono } = await req.json();

     if (!nombre || !correo || !contraseña || !tipoDocumento || !numeroDocumento || !telefono) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    // Buscar en todas las colecciones
    const existeEmpresa = await Empresa.findOne({ correo });
    const existeAdmin = await Administrador.findOne({ correo });
    const existeUsuario = await Usuario.findOne({ correo });

    if (existeEmpresa || existeAdmin || existeUsuario) {
      return new Response(
        JSON.stringify({ error: "Correo ya registrado en el sistema" }),
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(contraseña, 10);

  const nuevoUsuario= new Usuario({
    nombre,
    correo,
    contraseña: hash,
    tipoDocumento,
    numeroDocumento,
    telefono
  });

    await nuevoUsuario.save();

    return new Response(
      JSON.stringify({ mensaje: "Registro exitoso" }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en registro de empresa:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
