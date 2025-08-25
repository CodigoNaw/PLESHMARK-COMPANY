"use client";
import { useEffect, useState } from "react";
import { getUserData } from "@/utils/getUserData";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UsuarioDashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    nombre: "",
    numeroDocumento: "",
    correo: "",
    telefono: "",
    especialidad:""
  });
  const router = useRouter();

  const menuItems = [
    { icon: "/casita.png", label: "INICIO", link: "/usuario-dashboard" },
    { icon: "/postulacion.png", label: "CURRICULUM", link: "/usuario-dashboard/curriculum" },
    { icon: "/pqr.png", label: "PQRS", link: "/usuario-dashboard/pqrs" },
    { icon: "/archivito.png", label: "OFERTAS", link: "/usuario-dashboard/ofertas" },
  ];

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      setSidebarOpen(savedState === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    const data = getUserData();
    if (!data) {
      router.push("/usuario-login");
      return;
    }
    if (data.rol !== "usuario") {
      if (data.rol === "empresa") router.push("/empresa-dashboard");
      if (data.rol === "admin") router.push("/admin-dashboard");
      return;
    }
    setUser(data);
    setPreview(data.foto || null); // si ya tiene foto guardada
  }, [router]);

  // Manejo de subida de foto
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Preview temporal (solo mientras sube)
  setPreview(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append("foto", file);
  formData.append("id", user.id || user._id); // ⚠️ ojo: tu estado principal se llama user

  setLoading(true);
  try {
    const res = await fetch("/api/empresa/foto", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al subir foto");

    const updatedEmpresa = { ...user, foto: data.foto }; // seguimos usando user como estado
    setUser(updatedEmpresa);
    localStorage.setItem("userData", JSON.stringify(updatedEmpresa));
    setPreview(data.foto); // ✅ URL real de Cloudinary
  } catch (err) {
    console.error("Error subiendo foto:", err);
    alert("Error al subir foto");
  } finally {
    setLoading(false);
  }
};

  

  // Abrir modal con datos actuales
  const openEditModal = () => {
    setEditData({
      nombre: user.nombre || "",
      numeroDocumento: user.numeroDocumento || "",
      correo: user.correo || "",
      telefono: user.telefono || "",
      especialidad: user.especialidad || ""
    });
    setIsModalOpen(true);
  };

  // Guardar cambios del usuario
const handleSaveUsuario = async () => {
  try {
    const res = await fetch("/api/usuario/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id || user._id, ...editData })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error al actualizar");

    // ✅ Usa lo que devuelve el backend
    setUser(data.usuario);
    localStorage.setItem("userData", JSON.stringify(data.usuario));

    setIsModalOpen(false);
    alert("Información actualizada correctamente");
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    alert("No se pudo actualizar la información");
  }
};

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('')", backgroundAttachment: "fixed" }}>
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-r from-purple-700/90 via-purple-500/90 to-purple-700/90 backdrop-blur-md h-14 px-4 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={35} height={35} />
          <span className="text-white font-extrabold text-xl tracking-wider">PLESHMARK</span>
        </div>
        <div className="flex items-center gap-3">
          <p className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm border border-white/30">Rol: {user.rol}</p>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-2xl hover:scale-110 transition-transform">
            {sidebarOpen ? "−" : "☰"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside className={`bg-purple-700/90 backdrop-blur-xl border-r border-white/20 flex flex-col justify-between py-8 shadow-xl transition-all duration-500 rounded-br-[15px] ${sidebarOpen ? "w-64" : "w-20"}`}>
          <div>
            {/* Imagen de perfil con upload */}
            <div className="flex flex-col items-center mb-4">
              <input type="file" accept="image/*" id="upload-photo" className="hidden" onChange={handleImageUpload} />
              <label htmlFor="upload-photo" className="cursor-pointer relative">
                <img src={preview || "https://via.placeholder.com/80"} alt="Foto de perfil" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md hover:opacity-80 transition" />
                {loading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs rounded-full">Subiendo...</span>
                )}
              </label>
            </div>

            {/* Info usuario */}
            {sidebarOpen && (
              <div className="text-center px-2">
                <h2 className="text-white text-lg font-semibold drop-shadow-lg text-center break-words leading-tight max-w-[120px] mx-auto">{user.nombre}</h2>
                <p className="text-white/80 text-xs drop-shadow-sm">cc: {user.numeroDocumento}</p>
              </div>
            )}

            {/* Menu */}
            <nav className="flex flex-col gap-4 mt-8">
              {menuItems.map((item, index) => (
                <a key={index} href={item.link} className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-300 group">
                  <Image src={item.icon} alt={item.label} width={23} height={23} className="group-hover:scale-110 transition-transform drop-shadow-md" />
                  {sidebarOpen && <span className="tracking-wide text-sm">{item.label}</span>}
                </a>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <div className="px-4">
            <button onClick={() => { localStorage.removeItem("userData"); router.replace("/usuario-login"); }} className="bg-red-600 hover:bg-red-700 px-9 py-2 rounded-full font-semibold text-white shadow">
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex flex-col gap-8 w-full px-5 py-8 bg-[url('/fondo.png')] bg-cover bg-center">

          {/* Sección con info + imagen */}
          <section className="w-full flex gap-6">
            <div className="flex flex-col w-[489px]">
              <h2 className="text-lg font-extrabold text-purple-900 mb-2">INFORMACION PERSONAL</h2>
              <div className="bg-gray-200/90 rounded-[30px] p-8 relative h-[160px]" style={{ boxShadow: "10px 10px 20px rgba(186, 85, 255, 0.8), 5px 5px 30px rgba(186, 85, 255, 0.8)" }}>
                {/* Botón Editar */}
                <button onClick={openEditModal} className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all">
                  Editar ✏️
                </button>

                <p><span className="font-bold">Nombre Completo: </span> {user.nombre}</p>
                <p><span className="font-bold">Número de documento: </span> {user.numeroDocumento}</p>
                <p><span className="font-bold">Correo: </span> {user.correo}</p>
                <p><span className="font-bold">Teléfono: </span> {user.telefono}</p>
              </div>
            </div>

            <div className="flex flex-col w-[489px]">
              <h2 className="text-lg font-extrabold text-purple-900 mb-2">OFERTA RELAMPAGO</h2>
              <div className="rounded-[30px] overflow-hidden h-[160px]" style={{ boxShadow: "10px 10px 20px rgba(186, 85, 255, 0.8), 5px 5px 30px rgba(186, 85, 255, 0.8)" }}>
                <img src="/Mark1.png" alt="Publicidad Mark" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>

          {/* Categorías */}
          <section className="relative w-full">
            <h2 className="text-lg font-extrabold text-purple-900 mb-4">CATEGORÍAS DE HOY</h2>
            <div className="bg-gray-200/90 rounded-[30px] p-6 w-full" style={{ boxShadow: "10px 10px 20px rgba(186, 85, 255, 0.8), 5px 5px 30px rgba(186, 85, 255, 0.8)" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[25px] p-4 bg-gradient-to-r from-blue-700 to-purple-400 flex flex-col justify-between h-36">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">CREA UN CURRÍCULUM</h3>
                    <p className="text-sm text-white leading-tight">Las emresas podran</p>
                    <p className="text-sm text-white leading-tight">verlo y llamarte</p>
                  </div>
                  <a href="#" className="text-sm text-white font-bold self-end mt-2 hover:underline">VER</a>
                </div>
                <div className="rounded-[25px] p-4 bg-gradient-to-r from-blue-700 to-purple-400 flex flex-col justify-between h-36">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">BUSCA OFERTAS NUEVAS</h3>
                    <p className="text-sm text-white leading-tight">Hoy podria ser tu dia</p>
                    <p className="text-sm text-white leading-tight">conocer nuevas ofertas</p>
                  </div>
                  <a href="#" className="text-sm text-white font-bold self-end mt-2 hover:underline">VER</a>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ------------------ Modal ------------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[650px] max-w-[95%] shadow-2xl border border-purple-200 animate-fadeIn">
            <h3 className="text-xl font-bold mb-5 text-purple-700 border-b border-purple-100 pb-2">Editar información</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre completo</label>
                <input type="text" value={editData.nombre} onChange={(e) => setEditData(prev => ({ ...prev, nombre: e.target.value }))} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Número de documento</label>
                <input type="text" value={editData.numeroDocumento} onChange={(e) => setEditData(prev => ({ ...prev, numeroDocumento: e.target.value }))} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Correo</label>
                <input type="email" value={editData.correo} onChange={(e) => setEditData(prev => ({ ...prev, correo: e.target.value }))} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <input type="text" value={editData.telefono} onChange={(e) => setEditData(prev => ({ ...prev, telefono: e.target.value }))} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
  <label className="text-sm font-medium text-gray-600">Especialidad</label>
  <input
    type="text"
    value={editData.especialidad}
    onChange={(e) =>
      setEditData(prev => ({ ...prev, especialidad: e.target.value }))
    }
    placeholder="Ej: Programador Frontend, Diseñador, etc."
    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
</div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">Cancelar</button>
              <button onClick={handleSaveUsuario} className="px-5 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 shadow-md transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
