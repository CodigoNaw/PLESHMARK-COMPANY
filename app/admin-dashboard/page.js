"use client";
import { useEffect, useState } from "react";
import { getUserData } from "@/utils/getUserData";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Estado CRUD
  const [registros, setRegistros] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  // 🔹 Subir foto
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFotoPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("id", user.id || user._id);

    setLoading(true);
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
      setFotoPreview(data.foto);
    } catch (err) {
      console.error("Error subiendo foto:", err);
      alert("Error al subir foto");
    } finally {
      setLoading(false);
    }
  };

  // Validar usuario
  useEffect(() => {
    const data = getUserData();
    if (!data) {
      router.push("/administrador-login");
      return;
    }
    if (data.rol !== "admin") {
      if (data.rol === "usuario") router.push("/usuario-dashboard");
      if (data.rol === "empresa") router.push("/empresa-dashboard");
      return;
    }
    setUser(data);
    setFotoPreview(data.foto || null);
  }, [router]);

  useEffect(() => {
    if (user?.rol === "admin") {
      fetchRegistros();
    }
  }, [page, busqueda, user]);

  const fetchRegistros = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      if (busqueda) params.append("search", busqueda);

      const res = await fetch(`/api/admin/todos?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar datos");

      const data = await res.json();
      setRegistros(Array.isArray(data.registros) ? data.registros : []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
      setRegistros([]);
      setTotalPages(1);
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* 🔹 Header superior (traído de PQRS) */}
      <header className="flex items-center justify-between bg-gradient-to-r from-purple-700/90 via-purple-500/90 to-purple-700/90 h-16 px-6 shadow-lg fixed top-0 left-0 right-0 z-50">
        <h1 className="text-white font-extrabold text-xl tracking-wide">
          Panel de Administrador
        </h1>
        <p className="text-white font-medium text-sm">Rol: {user.rol}</p>
      </header>

      <div className="flex flex-1 pt-16">
        {/* 🔹 Sidebar fijo (traído de PQRS) */}
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
            <span className="text-purple-200 text-sm">
              CC: {user.numeroDocumento}
            </span>
            <span className="text-purple-200 text-sm mb-4">
              Rol: {user.rol}
            </span>

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

        {/* 🔹 Contenido principal (tu CRUD original) */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto bg-gray-100">
          <h1 className="flex items-center gap-2 text-purple-700 font-bold mb-6 text-3xl bg-white px-4 py-2 rounded-lg shadow-md">
            📋 Gestión de Registros - PLESHMARK
          </h1>

          {/* Buscador */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Buscar Caracteristica"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
            />
          </div>

          {/* Tabla */}
          <div
            className="overflow-x-auto rounded-xl shadow-md bg-white"
            style={{ maxWidth: "1453px" }}
          >
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-purple-700/90 text-white text-sm uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Identificación</th>
                  <th className="px-6 py-3">Correo</th>
                  <th className="px-6 py-3">Rol</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(registros) && registros.length > 0 ? (
                  registros.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={`hover:bg-purple-200 transition ${
                        idx % 2 === 0
                          ? "bg-white bg-opacity-80"
                          : "bg-purple-100 bg-opacity-80"
                      }`}
                    >
                      <td className="px-6 py-3 font-mono text-xs text-gray-500">
                        {r.id}
                      </td>
                      <td className="px-6 py-3">{r.nombre}</td>
                      <td className="px-6 py-3">{r.identificacion}</td>
                      <td className="px-6 py-3">{r.correo}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            r.rol === "admin"
                              ? "bg-red-100 text-red-700"
                              : r.rol === "empresa"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {r.rol}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-3 text-center text-gray-500"
                    >
                      No se encontraron registros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between mt-6 items-center">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-purple-200 hover:bg-purple-400 px-4 py-2 rounded-lg disabled:opacity-50 transition"
            >
              ⬅ Anterior
            </button>
            <span className="text-gray-700 font-medium">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-purple-200 hover:bg-purple-400 px-4 py-2 rounded-lg disabled:opacity-50 transition"
            >
              Siguiente ➡
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
