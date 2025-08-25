import dbConnect from "@/lib/mongodb";
import Pqrs from "@/models/Pqrs";

// Util: normalizar tipo ("petición" -> "peticion")
const normalize = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita acentos

// =========================
// POST  -> Crear PQRS
// Body: { usuarioId, rol, correo, motivo, tipo, descripcion }
// =========================
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    let { usuarioId, rol, correo, motivo, tipo, descripcion } = body;

    if (!usuarioId || !rol || !correo || !motivo || !tipo || !descripcion) {
      return new Response(JSON.stringify({ error: "Todos los campos son obligatorios" }), { status: 400 });
    }

    // Normaliza el tipo para que coincida con el enum del modelo
    tipo = normalize(tipo); // "petición" -> "peticion"

    const nueva = await Pqrs.create({
      usuarioId,
      rol,
      correo,
      motivo,
      tipo,
      descripcion,
    });

    return new Response(JSON.stringify(nueva), { status: 201 });
  } catch (error) {
    console.error("Error creando PQRS:", error);
    return new Response(JSON.stringify({ error: "Error creando PQRS" }), { status: 500 });
  }
}

// =========================
// GET -> Listar PQRS
// - ?usuarioId=xxx  -> lista solo las de ese usuario/empresa
// - sin usuarioId   -> lista todas (para admin)
// - opcional: ?estado=pending/respondido, ?tipo=peticion|queja|reclamo|sugerencia
// =========================
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const usuarioId = searchParams.get("usuarioId");
    const estado = searchParams.get("estado");
    const tipo = searchParams.get("tipo");

    const filtro = {};
    if (usuarioId) filtro.usuarioId = usuarioId;
    if (estado) filtro.estado = estado;
    if (tipo) filtro.tipo = normalize(tipo);

    const pqrs = await Pqrs.find(filtro).sort({ createdAt: -1 });

    return new Response(JSON.stringify(pqrs), { status: 200 });
  } catch (error) {
    console.error("Error obteniendo PQRS:", error);
    return new Response(JSON.stringify({ error: "Error obteniendo PQRS" }), { status: 500 });
  }
}

// =========================
// PUT -> Responder PQRS (admin)
// Body: { id, respuesta }
// =========================
export async function PUT(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { id, respuesta } = body;

    if (!id || !respuesta) {
      return new Response(JSON.stringify({ error: "ID y respuesta son obligatorios" }), { status: 400 });
    }

    const pqrs = await Pqrs.findByIdAndUpdate(
      id,
      { respuesta, estado: "respondido" },
      { new: true }
    );

    if (!pqrs) {
      return new Response(JSON.stringify({ error: "PQRS no encontrada" }), { status: 404 });
    }

    return new Response(JSON.stringify(pqrs), { status: 200 });
  } catch (error) {
    console.error("Error respondiendo PQRS:", error);
    return new Response(JSON.stringify({ error: "Error respondiendo PQRS" }), { status: 500 });
  }
}
