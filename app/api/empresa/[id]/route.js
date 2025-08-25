
import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const empresa = await Empresa.findById(params.id);
    if (!empresa) {
      return new Response(
        JSON.stringify({ error: "Empresa no encontrada" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(empresa), { status: 200 });
  } catch (error) {
    console.error("Error en GET empresa:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
} 
