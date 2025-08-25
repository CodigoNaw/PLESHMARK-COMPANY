import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";

export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("Body recibido en /api/empresa/update:", body);

    const { id, nombreEmpresa, telefono, tipoEmpresa, direccion, descripcion } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID de empresa requerido" }), { status: 400 });
    }

    const empresaActualizada = await Empresa.findByIdAndUpdate(
      id,
      { nombreEmpresa, telefono, tipoEmpresa, direccion, descripcion },
      { new: true }
    );

    if (!empresaActualizada) {
      return new Response(JSON.stringify({ error: "Empresa no encontrada" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        message: "Datos actualizados correctamente",
        empresa: empresaActualizada
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
