import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";
import Administrador from "@/models/Administrador";
import Usuario from "@/models/Usuario";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { nombreEmpresa, nit, direccion, correo, contraseña, tipoEmpresa, telefono } = await req.json();

    if (!nombreEmpresa || !nit || !direccion || !correo || !contraseña || !tipoEmpresa || !telefono) {
      return new Response(
        JSON.stringify({ error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    // Buscar en todas las colecciones
    const [existeEmpresa, existeAdmin, existeUsuario] = await Promise.all([
      Empresa.findOne({ correo }),
      Administrador.findOne({ correo }),
      Usuario.findOne({ correo }),
    ]);

    if (existeEmpresa || existeAdmin || existeUsuario) {
      return new Response(
        JSON.stringify({ error: "Correo ya registrado en el sistema" }),
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const nuevaEmpresa = new Empresa({
      nombreEmpresa,
      nit,
      direccion,
      correo,
      contraseña: hash,
      tipoEmpresa,
      telefono
    });

    await nuevaEmpresa.save();

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
