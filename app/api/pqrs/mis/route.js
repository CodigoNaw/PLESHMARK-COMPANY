import dbConnect from "@/lib/mongodb";
import Pqrs from "@/models/Pqrs";
import jwt from "jsonwebtoken";

export async function GET(req) {
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

    // Filtrar por usuario/empresa
    const pqrs = await Pqrs.find({ usuarioId: decoded.id }).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ pqrs }), { status: 200 });
  } catch (err) {
    console.error("Error obteniendo PQRS:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
