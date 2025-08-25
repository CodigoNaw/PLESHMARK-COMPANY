"use client";
import { useState } from "react";

export default function EmpresaForgotPage() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch("/api/empresa/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();
      setMensaje(data.mensaje || data.error);
    } catch (error) {
      setMensaje("Error al enviar la solicitud.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-4">Recuperar contraseña</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Ingresa tu correo registrado y te enviaremos un enlace de recuperación.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            {cargando ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
        {mensaje && (
          <p className="text-sm text-center mt-4 text-gray-700">{mensaje}</p>
        )}

        <div className="mt-6 text-center">
          {/* Aquí no es botón, es texto clickeable */}
          <a
            href="/login"
            className="text-blue-600 text-sm hover:underline cursor-pointer"
          >
            Volver al login
          </a>
        </div>
      </div>
    </div>
  );
}
