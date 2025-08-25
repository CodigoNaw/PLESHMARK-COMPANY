import dbConnect from "@/lib/mongodb";
import Administrador from "@/models/Administrador";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("foto");
    const id = formData.get("id");

    if (!file) {
      return new Response(JSON.stringify({ error: "No se subió ninguna foto" }), { status: 400 });
    }

    // Convertir a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar en carpeta /public/uploads
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    await writeFile(filePath, buffer);

    // Guardar ruta en la BD
    const administrador = await Administrador.findByIdAndUpdate(
      id,
      { foto: `/uploads/${fileName}` },
      { new: true }
    );

    return new Response(
      JSON.stringify({ message: "Foto subida", foto: administrador.foto }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error al subir foto:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}
