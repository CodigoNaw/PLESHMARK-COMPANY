import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; 
import Usuario from "@/models/Usuario"; // tu modelo

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const file = formData.get("foto");
    const userId = formData.get("id");

    if (!file) {
      return NextResponse.json({ error: "No se envió archivo" }, { status: 400 });
    }

    // Convertir file a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "usuarios" }, // carpeta en Cloudinary
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Actualizar usuario con URL de Cloudinary
    const usuario = await Usuario.findByIdAndUpdate(
      userId,
      { foto: uploadResponse.secure_url },
      { new: true }
    );

    return NextResponse.json({ foto: usuario.foto });
  } catch (err) {
    console.error("Error subiendo foto:", err);
    return NextResponse.json({ error: "Error al subir foto" }, { status: 500 });
  }
}
