"use client";
import { useEffect, useState } from "react";
import { getUserData } from "@/utils/getUserData";
import { useRouter } from "next/navigation";

export default function AdminPQRS() {
  const [user, setUser] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [pqrsList, setPqrsList] = useState([]);
  const [respuesta, setRespuesta] = useState("");
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  // 🔹 Subir foto
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFotoPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("id", user.id || user._id);

    try {
      const res = await fetch("/api/administrador/foto", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir foto");

      const updatedUser = { ...user, foto: data.foto };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      alert("Foto actualizada correctamente ✅");
    } catch (err) {
      console.error("Error subiendo foto:", err);
      alert("Error al subir foto");
    }
  };

  // 🔹 Validar admin
  useEffect(() => {
    const data = getUserData();
    if (!data) {
      router.push("/administrador-login");
      return;
    }
    if (data.rol !== "admin") {
      router.push("/");
      return;
    }
    setUser(data);
    setFotoPreview(data.foto || null);
    fetchPQRS();
  }, [router]);

  // 🔹 Cargar PQRS
  const fetchPQRS = async () => {
    try {
      const res = await fetch("/api/pqrs");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPqrsList(data);
    } catch (error) {
      console.error("Error cargando PQRS:", error);
    }
  };

  // 🔹 Responder PQRS
  const handleResponder = async () => {
    if (!selected || !respuesta.trim()) return;
    try {
      const res = await fetch("/api/pqrs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected._id, respuesta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("Respuesta enviada ✅");
      setRespuesta("");
      setSelected(null);
      fetchPQRS();
    } catch (error) {
      console.error("Error respondiendo PQRS:", error);
      alert("Error al responder");
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* 🔹 Header superior */}
      <header className="flex items-center justify-between bg-gradient-to-r from-purple-700/90 via-purple-500/90 to-purple-700/90 h-16 px-6 shadow-lg fixed top-0 left-0 right-0 z-50">
        <h1 className="text-white font-extrabold text-xl tracking-wide">
          Panel de Administrador
        </h1>
        <p className="text-white font-medium text-sm">Rol: {user.rol}</p>
      </header>

      <div className="flex flex-1 pt-16">
        {/* 🔹 Sidebar fijo */}
        <aside className="w-64 bg-gradient-to-b from-purple-700/90 via-purple-500/90 to-purple-700/90 flex flex-col items-center py-6 justify-between rounded-r-2xl fixed left-0 top-16 bottom-0 shadow-lg">
          <div className="flex flex-col items-center">
            {/* Foto perfil */}
            <div className="bg-gray-100 rounded-full p-2 mb-4 border-4 border-purple-600">
              <label className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition-transform transform hover:scale-105">
                {fotoPreview || user.foto ? (
                  <img
                    src={fotoPreview || user.foto}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm text-center px-2">
                    Subir foto
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Datos usuario */}
            <p className="text-white text-2xl font-bold mb-1">{user.nombre}</p>
            <span className="text-purple-200 text-sm">CC: {user.numeroDocumento}</span>
            <span className="text-purple-200 text-sm mb-4">Rol: {user.rol}</span>

            <button
              onClick={() => router.push("/admin-dashboard/pqrs")}
              className="mt-2 w-40 bg-white px-6 py-2 rounded-full font-semibold text-purple-900 shadow-md hover:shadow-xl transition-all duration-300"
            >
              PQRS
            </button>

            <button
              onClick={() => router.push("/admin-dashboard")}
              className="mt-2 w-40 bg-white px-6 py-2 rounded-full font-semibold text-purple-900 shadow-md hover:shadow-xl transition-all duration-300"
            >
              Panel Admin
            </button>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <button
              onClick={() => {
                localStorage.removeItem("userData");
                router.replace("/administrador-login");
              }}
              className="bg-red-600 hover:bg-red-700 px-12 py-2 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Cerrar Sesión
            </button>
            <p className="text-purple-200 text-sm">@Pleshmark</p>
          </div>
        </aside>

        {/* 🔹 Contenido principal scroll */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto bg-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-purple-700">
            📩 Gestión de PQRS
          </h1>

          <div className="overflow-x-auto rounded-xl shadow-md bg-white">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-purple-700 text-white uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Motivo</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pqrsList.length > 0 ? (
                  pqrsList.map((p) => (
                    <tr key={p._id} className="border-b hover:bg-purple-100">
                      <td className="px-4 py-2">{p.usuarioId}</td>
                      <td className="px-4 py-2">{p.rol}</td>
                      <td className="px-4 py-2">{p.correo}</td>
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
                        <button
                          onClick={() => setSelected(p)}
                          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                        >
                          Ver / Responder
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No hay PQRS registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal para responder */}
          {selected && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[95%] shadow-2xl border border-purple-200">
                {/* Título */}
                <h2 className="text-xl font-bold text-purple-700 mb-5 border-b pb-2 border-purple-100">
                  ✉️ Responder PQRS
                </h2>

                {/* Info */}
                <div className="bg-purple-50 rounded-lg p-3 mb-4 text-sm text-gray-700 border border-purple-100">
                  <p className="mb-1">
                    <strong className="text-purple-700">Motivo:</strong> {selected.motivo}
                  </p>
                  <p>
                    <strong className="text-purple-700">Descripción:</strong>{" "}
                    {selected.descripcion}
                  </p>
                </div>

                {/* Textarea */}
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-5 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
                  rows="5"
                  placeholder="✍️ Escribe tu respuesta..."
                />

                {/* Botones */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelected(null)}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleResponder}
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition"
                  >
                    Enviar respuesta 🚀
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
