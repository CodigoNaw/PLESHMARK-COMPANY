"use client";
import { useEffect, useState } from "react";
import { getUserData } from "@/utils/getUserData";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PqrsPage() {
  const [user, setUser] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [misPqrs, setMisPqrs] = useState([]);
  const router = useRouter();

  const menuItems = [
    { icon: "/casita.png", label: "INICIO", path: "/empresa-dashboard" },
    { icon: "/postulacion.png", label: "POSTULACIONES", path: "/empresa-dashboard/postulaciones" },
    { icon: "/pqr.png", label: "PQRS", path: "/empresa-dashboard/pqrs" },
    { icon: "/archivito.png", label: "OFERTAS", path: "/empresa-dashboard/ofertas" },
  ];

  // ✅ Validar rol
  useEffect(() => {
    const data = getUserData();
    if (!data) {
      router.push("/"); 
      return;
    }
    if (data.rol !== "usuario" && data.rol !== "empresa") {
      router.push("/");
      return;
    }
    setUser(data);
    fetchMisPQRS(data.id || data._id);
  }, [router]);

  // ✅ Obtener PQRS
  const fetchMisPQRS = async (id) => {
    try {
      const res = await fetch(`/api/pqrs?usuarioId=${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMisPqrs(data);
    } catch (error) {
      console.error("Error cargando PQRS:", error);
    }
  };

  // ✅ Enviar PQRS
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivo || !tipo || !descripcion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("/api/pqrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: user.id || user._id,
          rol: user.rol,
          correo: user.correo,
          motivo,
          tipo,
          descripcion,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("PQRS enviada correctamente ✅");
      setMotivo("");
      setTipo("");
      setDescripcion("");
      fetchMisPQRS(user.id || user._id);
    } catch (error) {
      console.error("Error enviando PQRS:", error);
      alert("No se pudo enviar la PQRS");
    }
  };

  if (!user) return null;

  return (
    <div
      className="h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: "url('')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 🔹 Header superior */}
      <header className="flex items-center justify-between bg-gradient-to-r from-purple-700/90 via-purple-500/90 to-purple-700/90 backdrop-blur-md h-14 px-4 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={35} height={35} />
          <span className="text-white font-extrabold text-xl tracking-wider">
            PLESHMARK
          </span>
        </div>

        <div className="flex items-center gap-3">
          <p className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm border border-white/30">
            Rol: {user.rol}
          </p>
        </div>
      </header>

      <div className="flex flex-1 pt-14">
        {/* 🔹 Sidebar fijo */}
        <aside className="w-64 bg-purple-700/90 backdrop-blur-xl border-r border-white/20 flex flex-col justify-between py-8 shadow-xl fixed left-0 top-14 bottom-0">
          <div>
            <div className="text-center px-2">
              <h2 className="text-white text-2xl font-semibold drop-shadow-lg">
                {user.nombreEmpresa || user.nombre}
              </h2>
                <p className="text-white/80 text-sm drop-shadow-sm">
                  NIT: {user.nit}
                </p>
            </div>

            <nav className="flex flex-col gap-6 mt-10">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className="flex items-center gap-4 px-6 py-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-300 group w-full text-left"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={28}
                    height={28}
                    className="group-hover:scale-110 transition-transform drop-shadow-md"
                  />
                  <span className="tracking-wide">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="px-4">
            <button
              onClick={() => {
                localStorage.removeItem("userData");
                router.replace("/empresa-login");
              }}
              className="bg-red-600 hover:bg-red-700 px-12 py-2 rounded-full font-semibold text-white shadow"
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* 🔹 Contenido principal con scroll */}
       <main className="flex-1 ml-64 p-6 text-black overflow-y-auto">
  <h1 className="text-2xl font-bold text-purple-700 mb-6">
    📩 Enviar PQRS
  </h1>

  {/* Formulario */}
  <form
    onSubmit={handleSubmit}
    className="bg-white rounded-xl p-6 shadow-md mb-8"
  >
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium">Motivo</label>
        <input
          type="text"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Ej: Problema con la plataforma"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Tipo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full border rounded-lg p-2 mt-1"
        >
          <option value="">Selecciona un tipo</option>
          <option value="petición">Petición</option>
          <option value="queja">Queja</option>
          <option value="reclamo">Reclamo</option>
          <option value="sugerencia">Sugerencia</option>
        </select>
      </div>
    </div>

    <div className="mt-4">
      <label className="text-sm font-medium">Descripción</label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full border rounded-lg p-2 mt-1"
        rows="4"
        placeholder="Explica tu situación..."
      />
    </div>

    <button
      type="submit"
      className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
    >
      Enviar PQRS
    </button>
  </form>

  {/* Listado de PQRS */}
  <h2 className="text-xl font-semibold text-purple-700 mb-3">
    📜 Mis PQRS
  </h2>
  <div className="overflow-x-auto bg-white rounded-xl shadow-md">
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-purple-700 text-white uppercase text-xs tracking-wide">
        <tr>
          <th className="px-4 py-3">Motivo</th>
          <th className="px-4 py-3">Tipo</th>
          <th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3">Respuesta</th>
        </tr>
      </thead>
      <tbody>
        {misPqrs.length > 0 ? (
          misPqrs.map((p) => (
            <tr key={p._id} className="border-b hover:bg-purple-100">
              <td className="px-4 py-2">{p.motivo}</td>
              <td className="px-4 py-2">{p.tipo}</td>
              <td className="px-4 py-2">
                {p.estado === "pendiente" ? (
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    Pendiente
                  </span>
                ) : (
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                    Respondido
                  </span>
                )}
              </td>
              <td className="px-4 py-2">
                {p.respuesta ? p.respuesta : "Sin respuesta aún"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">
              Aún no has enviado PQRS
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</main>
      </div>
    </div>
  );
}
