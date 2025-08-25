import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; 
import Empresa from "@/models/Empresa"; // modelo de Empresa

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
    const empresaId = formData.get("id");

    if (!file) {
      return NextResponse.json({ error: "No se envió archivo" }, { status: 400 });
    }

    // Convertir file a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary en carpeta "empresas"
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "empresas" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Actualizar empresa con la URL de Cloudinary
    const empresa = await Empresa.findByIdAndUpdate(
      empresaId,
      { foto: uploadResponse.secure_url },
      { new: true }
    );

    return NextResponse.json({ foto: empresa.foto });
  } catch (err) {
    console.error("Error subiendo foto de empresa:", err);
    return NextResponse.json({ error: "Error al subir foto" }, { status: 500 });
  }
}
