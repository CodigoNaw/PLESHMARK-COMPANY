import dbConnect from "@/lib/mongodb";
import Pqrs from "@/models/Pqrs";
import jwt from "jsonwebtoken";

const TIPOS = ["Petición", "Queja", "Reclamo", "Sugerencia"];

export async function POST(req) {
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

    // Body: motivo, tipo, descripcion
    const { motivo, tipo, descripcion } = await req.json();

    if (!motivo || !tipo || !descripcion) {
      return new Response(JSON.stringify({ error: "motivo, tipo y descripcion son obligatorios" }), { status: 400 });
    }
    if (!TIPOS.includes(tipo)) {
      return new Response(JSON.stringify({ error: "tipo inválido" }), { status: 400 });
    }
    if (!decoded?.id || !decoded?.rol || !decoded?.correo) {
      return new Response(JSON.stringify({ error: "Datos de remitente incompletos en el token" }), { status: 400 });
    }
    if (!["usuario", "empresa"].includes(decoded.rol)) {
      return new Response(JSON.stringify({ error: "Solo usuario o empresa pueden crear PQRS" }), { status: 403 });
    }

    const pqr = await Pqrs.create({
      remitenteId: decoded.id,
      rol: decoded.rol,
      correo: decoded.correo,
      remitenteNombre: decoded.nombre || decoded.nombreEmpresa || "",
      tipo,
      motivo,
      descripcion,
      estado: "Pendiente",
      fecha: new Date(),
    });

    return new Response(JSON.stringify({ message: "PQR creado", pqr }), { status: 201 });
  } catch (err) {
    console.error("Error creando PQR:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
