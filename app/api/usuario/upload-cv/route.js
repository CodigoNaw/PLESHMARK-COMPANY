import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/mongodb";
import Usuario from "@/models/Usuario";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file"); // PDF
    const userId = formData.get("userId"); // ID del usuario

    if (!file) {
      return new Response(JSON.stringify({ error: "No se subió archivo" }), { status: 400 });
    }

    // Convertir el archivo en buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", folder: "curriculums" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // Guardar URL en el usuario
    await Usuario.findByIdAndUpdate(userId, { pdfCurriculum: result.secure_url });

    return new Response(JSON.stringify({ url: result.secure_url }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
