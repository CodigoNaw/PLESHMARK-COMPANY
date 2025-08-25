"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function EmpresaResetPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token"); // viene del correo
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!token) {
      setMensaje("Token inválido o faltante.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmar) {
      return setMensaje("Las contraseñas no coinciden.");
    }

    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch("/api/empresa/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaContraseña: password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("Contraseña restablecida correctamente.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMensaje(data.error || "Error al restablecer la contraseña.");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-4">Restablecer contraseña</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={cargando || !token}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"

          >
            {cargando ? "Guardando..." : "Restablecer"}
          </button>
        </form>
        {mensaje && (
          <p className="text-sm text-center mt-4 text-gray-700">{mensaje}</p>
        )}
      </div>
    </div>
  );
}
