import dbConnect from "@/lib/dbConnect";
import Usuario from "@/models/Usuario";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { especialidad } = req.query;

    try {
      const usuarios = await Usuario.find(
        especialidad ? { especialidad: { $regex: especialidad, $options: "i" } } : {}
      ).select("-curriculum.data"); // no mandamos el PDF binario en la búsqueda

      return res.status(200).json({ success: true, data: usuarios });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }
}
