import dbConnect from "@/lib/mongodb";
import Pqrs from "@/models/Pqrs";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await dbConnect();

    // Leer token
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

    // Solo admin responde
    if (decoded.rol !== "admin") {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 403 });
    }

    // Datos enviados por el admin
    const { id, respuesta } = await req.json();
    if (!id || !respuesta) {
      return new Response(JSON.stringify({ error: "ID y respuesta son requeridos" }), { status: 400 });
    }

    // Actualizar el PQRS
    const pqrsActualizado = await Pqrs.findByIdAndUpdate(
      id,
      {
        respuesta,
        estado: "resuelto",
        respondidoPor: decoded.id,
        fechaRespuesta: new Date()
      },
      { new: true }
    );

    if (!pqrsActualizado) {
      return new Response(JSON.stringify({ error: "PQRS no encontrado" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ message: "Respuesta enviada", pqrs: pqrsActualizado }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error respondiendo PQRS:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
