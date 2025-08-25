"use client";
import { useEffect, useState } from "react";
import { getUserData } from "@/utils/getUserData";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EmpresaDashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    nombreEmpresa: "",
    telefono: "",
    tipoEmpresa: "",
    direccion: "",
    descripcion: ""
  });
  const router = useRouter();

  const menuItems = [
    { icon: "/casita.png", label: "INICIO" },
    { icon: "/postulacion.png", label: "POSTULACIONES" },
    { icon: "/pqr.png", label: "PQRS" },
    { icon: "/archivito.png", label: "OFERTAS" },
  ];

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    const tokenData = getUserData();
    console.log("Datos cargados en dashboard:", tokenData);

    if (!tokenData) {
      router.push("/empresa-login");
      return;
    }
    if (tokenData.rol !== "empresa") {
      if (tokenData.rol === "admin") router.push("/admin-dashboard");
      if (tokenData.rol === "usuario") router.push("/usuario-dashboard");
      return;
    }

    setUser(tokenData);
    setFotoPreview(tokenData.foto || null);

    fetch(`/api/empresa/${tokenData.id || tokenData._id}`)
      .then(res => res.json())
      .then(info => {
        const mergedUser = {
          ...tokenData,
          ...info,
          id: tokenData.id || tokenData._id || info.id || info._id
        };
        setUser(mergedUser);
        setEditData({
          nombreEmpresa: mergedUser.nombreEmpresa || "",
          telefono: mergedUser.telefono || "",
          tipoEmpresa: mergedUser.tipoEmpresa || "",
          direccion: mergedUser.direccion || "",
          descripcion: mergedUser.descripcion || ""
        });
        setFotoPreview(mergedUser.foto || null);
        localStorage.setItem("userData", JSON.stringify(mergedUser));
      })
      .catch(err => console.error("Error cargando empresa:", err));
  }, [router]);

  // 🔹 Subir foto
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFotoPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("foto", file);
    formData.append("id", user.id || user._id);

    try {
      const res = await fetch("/api/empresa/foto", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir foto");

      const updatedUser = {
        ...user,
        foto: data.foto,
        id: user.id || user._id
      };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      alert("Foto actualizada correctamente");
    } catch (err) {
      console.error("Error subiendo foto:", err);
      alert("Error al subir foto");
    }
  };

  // 🔹 Guardar cambios en modal
  const handleSave = async () => {
    const userData = getUserData();
    console.log("UserData en handleSave:", userData);

    if (!userData?.id && !userData?._id) {
      alert("ID de empresa requerido");
      return;
    }

    try {
      const res = await fetch("/api/empresa/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: userData.id || userData._id,
          ...editData
        })
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || "Error al actualizar");
      }

      const updatedUser = {
        ...user,
        ...editData,
        id: user.id || user._id
      };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      setIsModalOpen(false);
      alert("Cambios guardados correctamente");
    } catch (err) {
      console.error("Error guardando:", err);
      alert(err.message || "No se pudo actualizar");
    }
  };

  // 🔹 Abrir modal
  const openEditModal = () => {
    setEditData({
      nombreEmpresa: user.nombreEmpresa || "",
      telefono: user.telefono || "",
      tipoEmpresa: user.tipoEmpresa || "",
      direccion: user.direccion || "",
      descripcion: user?.descripcion || ""
    });
    setIsModalOpen(true);
  };

  if (!user) return null;

  return (
    <div
      className="h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: "url('')",
        backgroundAttachment: "fixed"
      }}
    >

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
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white text-2xl hover:scale-110 transition-transform"
          >
            {sidebarOpen ? "−" : "☰"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-14">
<aside
  className={`fixed top-14 left-0 bottom-0 z-40 h-[540px] overflow-hidden bg-purple-700/90 backdrop-blur-xl border-r border-white/20 flex flex-col justify-between py-8 shadow-xl transition-all duration-500 rounded-br-[15px] ${
    sidebarOpen ? "w-64" : "w-20"
  }`}
>
  <div>
    {sidebarOpen && (
      <div className="text-center px-2">
        <h2 className="text-white text-2xl font-semibold drop-shadow-lg text-center break-words leading-tight max-w-[150px] mx-auto">
          {user.nombreEmpresa}
        </h2>
        <p className="text-white/80 text-sm drop-shadow-sm">
          NIT: {user.nit}
        </p>
      </div>
    )}

    <nav className="flex flex-col gap-6 mt-10">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            if (item.label === "PQRS") {
              router.push("/empresa-dashboard/pqrs");
            } else if (item.label === "INICIO") {
              router.push("/empresa-dashboard");
            } else if (item.label === "POSTULACIONES") {
              router.push("/empresa-dashboard/postulaciones");
            } else if (item.label === "OFERTAS") {
              router.push("/empresa-dashboard/ofertas");
            }
          }}
          className="flex items-center gap-4 px-6 py-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-300 group w-full text-left"
        >
          <Image
            src={item.icon}
            alt={item.label}
            width={28}
            height={28}
            className="group-hover:scale-110 transition-transform drop-shadow-md"
          />
          {sidebarOpen && <span className="tracking-wide">{item.label}</span>}
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
      className="bg-cyan-600 hover:bg-red-700 px-12 py-2 rounded-full font-semibold text-white shadow"
    >
      Cerrar Sesión
    </button>
  </div>
</aside>





  <main
    className={`flex-1 p-6 transition-all duration-500 ${
      sidebarOpen ? "ml-64" : "ml-20"
    }`}
  >
  <div
    className="w-full max-w-5xl min-h-[500px] rounded-3xl p-8 border border-gray-300 bg-white/80 backdrop-blur-lg relative shadow-xl"
    style={{
      boxShadow: "10px 10px 20px rgba(157, 0, 255, 0.8)", // sombra rosa brillante
      borderRight: "2px solid rgba(191, 0, 255, 0.9)",
      borderBottom: "2px solid rgba(255, 0, 150, 0.9)",
    }}
  >
    {/* Botón Editar */}
    <button
      onClick={openEditModal}
      className="absolute top-4 right-4 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-200"
    >
      Editar ✏️
    </button>

    <div className="flex items-center gap-6 mb-6">
      <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative">
        {fotoPreview ? (
          <img src={fotoPreview} alt="Foto empresa" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500 text-sm">Sin foto</span>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFotoChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      <h2 className="text-[40px] font-bold leading-tight break-words">
        {user.nombreEmpresa || "Nombre de la Empresa"}
      </h2>
    </div>

    <div className="grid grid-cols-2 gap-y-[10px] gap-x-6">
      <p className="text-gray-700">NIT: {user.nit}</p>
      <p className="text-gray-700">Teléfono: {user.telefono || "No registrado"}</p>
      <p className="text-gray-700">Tipo empresa: {user.tipoEmpresa || "No registrado"}</p>
      <p className="text-gray-700">Dirección: {user.direccion || "No registrada"}</p>
      <p className="text-gray-700">Correo: {user.correo}</p>
    </div>

    <div className="mt-6">
      <h2 className="text-gray-800 leading-relaxed">
        {user.descripcion || "Esta empresa aún no ha agregado una descripción."}
      </h2>
    </div>

    {/* Contenedores PERFIL y CURRICULUM alineados a la izquierda */}
    <div className="mt-10 flex gap-6 justify-start">
      {/* PERFIL */}
      <div className="bg-cyan-600 text-white w-60 h-20 rounded-lg shadow-lg flex flex-col justify-between p-4">
        <h3 className="text-xl font-bold">PERFIL</h3>
        <a
          href="/perfil"
          className="text-sm font-semibold self-end hover:underline"
        >
          VER MAS
        </a>
      </div>

      {/* CURRICULUM */}
      <div className="bg-cyan-600 text-white w-60 h-20 rounded-lg shadow-lg flex flex-col justify-between p-4">
        <h3 className="text-xl font-bold">CURRICULUM</h3>
        <a
          href="/curriculum"
          className="text-sm font-semibold self-end hover:underline"
        >
          VER MAS
        </a>
      </div>
    </div>
  </div>
</main>



      </div>

      {/* ------------------ Modal (insertado, sin tocar tu layout) ------------------ */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[650px] max-w-[95%] shadow-2xl border border-purple-200 animate-fadeIn">
      <h3 className="text-xl font-bold mb-5 text-purple-700 border-b border-purple-100 pb-2">
        Editar información
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Nombre de la empresa</label>
          <input
            type="text"
            value={editData.nombreEmpresa}
            onChange={(e) => setEditData(prev => ({ ...prev, nombreEmpresa: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Teléfono</label>
          <input
            type="text"
            value={editData.telefono}
            onChange={(e) => setEditData(prev => ({ ...prev, telefono: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Tipo de empresa</label>
          <input
            type="text"
            value={editData.tipoEmpresa}
            onChange={(e) => setEditData(prev => ({ ...prev, tipoEmpresa: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Dirección</label>
          <input
            type="text"
            value={editData.direccion}
            onChange={(e) => setEditData(prev => ({ ...prev, direccion: e.target.value }))}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-600">Descripción</label>
          <textarea
            value={editData.descripcion}
            onChange={(e) => setEditData(prev => ({ ...prev, descripcion: e.target.value }))}
            className="w-full p-2 border rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 shadow-md transition-colors"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}



      {/* ------------------------------------------------------------------------- */}

    </div>
  );
}
