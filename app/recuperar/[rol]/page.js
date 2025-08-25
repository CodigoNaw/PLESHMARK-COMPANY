"use client";
import { useState } from "react";

export default function RecuperarContraseña() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await fetch("/api/empresa/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocurrió un error");
        return;
      }

      setMensaje("Hemos enviado un enlace de recuperación a tu correo.");
      setCorreo("");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96 border border-purple-500">
        <h1 className="text-xl font-bold text-center">Recuperar contraseña</h1>
        <p className="text-gray-600 text-sm mt-1 text-center">
          Ingresa tu correo para recuperar tu cuenta
        </p>
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border border-purple-300 rounded-full px-4 py-2"
            required
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {mensaje && <p className="text-green-500 text-sm mt-2">{mensaje}</p>}
          <button
            type="submit"
            className="mt-6 w-full bg-purple-700 text-white font-semibold py-2 rounded-full hover:bg-purple-800 transition"
          >
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
}
