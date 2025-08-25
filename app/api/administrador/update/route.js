import dbConnect from "@/lib/mongodb";
import Administrador from "@/models/Administrador";

export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("Body recibido en /api/administrador/update:", body);

    const { id, nombre, telefono, tipoDocumento, direccion  } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID de empresa requerido" }), { status: 400 });
    }

    const administradorActualizada = await Administrador.findByIdAndUpdate(
      id,
      { nombre, telefono, tipoDocumento, direccion },
      { new: true }
    );

    if (!administradorActualizada) {
      return new Response(JSON.stringify({ error: "Administrador no encontrada" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        message: "Datos actualizados correctamente",
        empresa: administradorActualizada
      }),
      { status: 200 }
    );
  } catch (err) {
  console.error("Error en update:", err); // 👈 Esto mostrará el error real en la terminal
  return new Response(
    JSON.stringify({ error: "Error interno del servidor" }),
    { status: 500 });
  }
}
