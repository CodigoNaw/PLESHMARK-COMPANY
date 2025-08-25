import dbConnect from "@/lib/mongodb";
import Usuario from "@/models/Usuario";
import Empresa from "@/models/Empresa";
import Administrador from "@/models/Administrador";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 4;
    const skip = (page - 1) * limit;

    const id = searchParams.get("id") || null;
    const search = searchParams.get("search")?.trim() || null;

    // Filtros por colección
    let usuarioFilter = {};
    let empresaFilter = {};
    let adminFilter = {};

    if (id) {
      usuarioFilter._id = id;
      empresaFilter._id = id;
      adminFilter._id = id;
    } else if (search) {
      const regex = new RegExp(search, "i");
      usuarioFilter.$or = [
        { nombre: regex },
        { correo: regex },
        { rol: regex },
        { tipoDocumento: regex },
        { numeroDocumento: regex }
      ];
      empresaFilter.$or = [
        { nombreEmpresa: regex },
        { correo: regex },
        { rol: regex },
        { nit: regex },
        { tipoEmpresa: regex }
      ];
      adminFilter.$or = [
        { nombre: regex },
        { correo: regex },
        { rol: regex },
        { tipoDocumento: regex },
        { numeroDocumento: regex }
      ];
    }

    // Consultas
    const usuarios = await Usuario.find(usuarioFilter)
      .select("_id nombre tipoDocumento numeroDocumento correo telefono rol")
      .lean();

    const empresas = await Empresa.find(empresaFilter)
      .select("_id nombreEmpresa nit direccion correo telefono tipoEmpresa rol")
      .lean();

    const administradores = await Administrador.find(adminFilter)
      .select("_id nombre tipoDocumento numeroDocumento correo telefono rol ")
      .lean();


    // Unificar
    const data = [
      ...usuarios.map(u => ({
        id: u._id,
        nombre: u.nombre,
        identificacion: `${u.tipoDocumento} ${u.numeroDocumento}`,
        correo: u.correo,
        telefono: u.telefono,
        rol: u.rol || "usuario",
      })),
      ...empresas.map(e => ({
        id: e._id,
        nombre: e.nombreEmpresa,
        identificacion: e.nit,
        correo: e.correo,
        telefono: e.telefono,
        rol: e.rol || "empresa",
      })),
      ...administradores.map(a => ({
        id: a._id,
        nombre: a.nombre,
        identificacion: `${a.tipoDocumento} ${a.numeroDocumento}`,
        correo: a.correo,
        telefono: a.telefono,
        rol: a.rol || "admin",
      })),
    ];

    const total = data.length;
    const paginated = data.slice(skip, skip + limit);

    return new Response(
      JSON.stringify({
        registros: paginated,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error obteniendo datos:", error);
    return new Response(
      JSON.stringify({
        registros: [],
        total: 0,
        page: 1,
        totalPages: 1,
        error: "Error al obtener datos",
      }),
      { status: 500 }
    );
  }
}
