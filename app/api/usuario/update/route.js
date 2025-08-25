import dbConnect from "@/lib/mongodb";
import Usuario from "@/models/Usuario";

export async function PUT(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("Body recibido en /api/usuario/update:", body);

    const { id, nombre, numeroDocumento, correo, telefono, especialidad } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID de usuario requerido" }), 
        { status: 400 }
      );
    }

    // ✅ Usamos $set para asegurar que especialidad se actualiza
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      { 
        $set: { 
          nombre, 
          numeroDocumento, 
          correo, 
          telefono, 
          especialidad 
        } 
      },
      { 
        new: true,
        runValidators: true,   // valida contra el schema
        omitUndefined: true    // evita sobreescribir con undefined
      }
    );

    console.log("Usuario actualizado:", usuarioActualizado);

    if (!usuarioActualizado) {
      return new Response(
        JSON.stringify({ error: "Usuario no encontrado" }), 
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Datos actualizados correctamente",
        usuario: usuarioActualizado
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error en update usuario:", err);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
