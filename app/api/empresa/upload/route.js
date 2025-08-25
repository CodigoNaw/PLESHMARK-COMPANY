import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const id = formData.get("id");
    const file = formData.get("file");

    if (!id || !file) {
      return new Response(
        JSON.stringify({ error: "Faltan datos: id o archivo" }),
        { status: 400 }
      );
    }

    // Subir a Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "empresas" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    // Guardar URL en la empresa
    const empresa = await Empresa.findByIdAndUpdate(
      id,
      { foto: uploadResult.secure_url },
      { new: true }
    );

    return new Response(
      JSON.stringify({
        message: "Foto subida y guardada correctamente",
        empresa,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error en upload:", err);
    return new Response(
      JSON.stringify({ error: "Error interno en el servidor" }),
      { status: 500 }
    );
  }
}
