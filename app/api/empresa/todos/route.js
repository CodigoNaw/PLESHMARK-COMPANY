import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const search = searchParams.get("search") || "";

    const query = search
      ? { nombreEmpresa: { $regex: search, $options: "i" } }
      : {};

    const total = await Empresa.countDocuments(query);
    const registros = await Empresa.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    return new Response(
      JSON.stringify({
        registros,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Error en el servidor" }),
      { status: 500 }
    );
  }
}
