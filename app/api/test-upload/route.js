import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No se recibió archivo" }),
        { status: 400 }
      );
    }

    // Convierte el archivo en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subida a Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // acepta PDF
          folder: "curriculums", // carpeta en Cloudinary
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return new Response(
      JSON.stringify({ url: result.secure_url }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en test-upload:", error);
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500 }
    );
  }
}
