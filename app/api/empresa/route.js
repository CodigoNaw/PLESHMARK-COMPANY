import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await dbConnect();

    // Leer token del header Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Token requerido" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Token inválido o expirado" }), { status: 403 });
    }

    // Extraer datos enviados
    const body = await req.json();
    const { nombreEmpresa, telefono, tipoEmpresa, direccion, descripcion } = body;

    // Actualizar empresa en la base de datos
    const empresaActualizada = await Empresa.findByIdAndUpdate(
      decoded.id, // id viene del token
      { nombreEmpresa, telefono, tipoEmpresa, direccion, descripcion },
      { new: true }
    );

    if (!empresaActualizada) {
      return new Response(JSON.stringify({ error: "Empresa no encontrada" }), { status: 404 });
    }

    return new Response(JSON.stringify({
      message: "Datos actualizados correctamente",
      empresa: empresaActualizada
    }), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
