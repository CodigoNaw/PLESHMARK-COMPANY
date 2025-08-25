import dbConnect from "@/lib/mongodb";
import Pqrs from "@/models/Pqrs";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    // Token en header
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

    // Solo el administrador puede ver todos
    if (decoded.rol !== "admin") {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 403 });
    }

    // Listar todos los PQRS
    const pqrs = await Pqrs.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify({ pqrs }), { status: 200 });
  } catch (err) {
    console.error("Error listando todos los PQRS:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}
