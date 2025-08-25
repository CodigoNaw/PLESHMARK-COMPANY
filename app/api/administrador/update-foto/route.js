import dbConnect from "@/lib/mongodb";
import Administrador from "@/models/Administrador";

export async function PUT(req) {
  try {
    await dbConnect();
    const { id, foto } = await req.json();

    if (!id || !foto) {
      return new Response(JSON.stringify({ error: "ID y foto son requeridos" }), { status: 400 });
    }

    const administrador = await Administrador.findByIdAndUpdate(id, { foto }, { new: true });
    if (!administrador) {
      return new Response(JSON.stringify({ error: "Administrador no encontrada" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Foto actualizada", administrador }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
