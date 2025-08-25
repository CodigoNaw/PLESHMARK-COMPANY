"use client";
import { useEffect, useState } from "react";
import { getUserData } from "@/utils/getUserData";
import { useRouter } from "next/navigation";

export default function EmpresaPQRS() {
  const [user, setUser] = useState(null);
  const [pqrs, setPqrs] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const router = useRouter();

  useEffect(() => {
    const data = getUserData();
    if (!data) {
      router.push("/empresa-login");
      return;
    }
    if (data.rol !== "empresa") {
      router.push("/");
      return;
    }
    setUser(data);
    fetchPQRS(data.id || data._id);
  }, [router]);

  const fetchPQRS = async (id) => {
    try {
      const res = await fetch(`/api/pqrs?usuarioId=${id}`);
      const data = await res.json();
      if (res.ok) setPqrs(data);
    } catch (err) {
      console.error("Error cargando PQRS:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivo || !tipo || !descripcion) return alert("Todos los campos son obligatorios");

    try {
      const res = await fetch("/api/pqrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: user.id || user._id,
          rol: "empresa",
          correo: user.correo,
          motivo,
          tipo,
          descripcion,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar PQRS");

      setPqrs((prev) => [data, ...prev]);
      setMotivo("");
      setTipo("");
      setDescripcion("");
      alert("PQRS enviada correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("Error al enviar PQRS");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📩 PQRS - Empresa</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Motivo</label>
            <input
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Ejemplo: Problema con el sistema"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Selecciona tipo</option>
              <option value="peticion">Petición</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
              <option value="sugerencia">Sugerencia</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Escribe aquí tu solicitud..."
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Enviar PQRS
        </button>
      </form>

      {/* Listado */}
      <h2 className="text-xl font-semibold mb-3">📜 Mis PQRS</h2>
      <div className="space-y-4">
        {pqrs.length > 0 ? (
          pqrs.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow">
              <p><strong>Motivo:</strong> {p.motivo}</p>
              <p><strong>Tipo:</strong> {p.tipo}</p>
              <p><strong>Descripción:</strong> {p.descripcion}</p>
              <p><strong>Estado:</strong> {p.estado}</p>
              <p><strong>Respuesta Admin:</strong> {p.respuesta || "Pendiente"}</p>
              <p className="text-sm text-gray-500">📅 {new Date(p.fecha).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No has enviado PQRS todavía</p>
        )}
      </div>
    </div>
  );
}
