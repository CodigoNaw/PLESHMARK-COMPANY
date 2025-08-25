import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; 
import Administrador from "@/models/Administrador"; // modelo de Administrador

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
    const adminId = formData.get("id");

    if (!file || !adminId) {
      return NextResponse.json(
        { error: "Faltan datos (foto o id)" },
        { status: 400 }
      );
    }

    // Convertir file a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary en carpeta "administradores"
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "administradores" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Actualizar administrador con la URL de Cloudinary
    const admin = await Administrador.findByIdAndUpdate(
      adminId,
      { foto: uploadResponse.secure_url },
      { new: true }
    );

    if (!admin) {
      return NextResponse.json(
        { error: "Administrador no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ foto: admin.foto });
  } catch (err) {
    console.error("❌ Error subiendo foto de administrador:", err);
    return NextResponse.json(
      { error: "Error al subir foto" },
      { status: 500 }
    );
  }
}
