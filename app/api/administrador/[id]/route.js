
import dbConnect from "@/lib/mongodb";
import Administrador from "@/models/Administrador";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const administrador = await Administrador.findById(params.id);
    if (!administrador) {
      return new Response(
        JSON.stringify({ error: "Administrador no encontrado" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(Administrador), { status: 200 });
  } catch (error) {
    console.error("Error en GET administrador:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
} 
