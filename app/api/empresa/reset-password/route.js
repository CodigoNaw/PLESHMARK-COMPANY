import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();
    const { token, nuevaContraseña } = await req.json();

    if (!token || !nuevaContraseña) {
      return new Response(
        JSON.stringify({ error: "Token y nueva contraseña son requeridos" }),
        { status: 400 }
      );
    }

    // Verificar el token con JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Token inválido o expirado" }),
        { status: 400 }
      );
    }

    const empresa = await Empresa.findById(decoded.id);
    if (!empresa) {
      return new Response(
        JSON.stringify({ error: "Empresa no encontrada" }),
        { status: 404 }
      );
    }

    // Hashear la nueva contraseña
    const hash = await bcrypt.hash(nuevaContraseña, 10);
    empresa.contraseña = hash;
    await empresa.save();

    return new Response(
      JSON.stringify({ mensaje: "Contraseña actualizada correctamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en reset-password:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
