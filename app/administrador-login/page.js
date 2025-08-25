"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function AdministradorLogin() {
  const [modoRegistro, setModoRegistro] = useState(false);

  // Campos de registro
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");

  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    if (contraseña !== confirmarContraseña) {
      return setError("Las contraseñas no coinciden");
    }
    const res = await fetch("/api/administrador/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contraseña, tipoDocumento, numeroDocumento, telefono }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    alert("Registro exitoso, ahora inicia sesión");
    setModoRegistro(false);
  };

 const handleLogin = async () => {
  setError("");
  const res = await fetch("/api/administrador/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contraseña }),
  });
  const data = await res.json();
  if (!res.ok) return setError(data.error);

  // Guardar token y user
  localStorage.setItem("token", data.token);
  localStorage.setItem("userData", JSON.stringify(data.user));

  router.push("/admin-dashboard");
};
  return (
    <div className="min-h-screen bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: "url('/f3.png')" }}>
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center border border-purple-500" style={{ width: "400px" }}>
        <Link href="/"><Image src="/Logo.png" alt="Logo Pleshmark" width={50} height={50} className="mb-4" /></Link>

        {!modoRegistro ? (
          <>
            <h1 className="text-xl font-bold">Inicia Sesión</h1>
            <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} className="mt-6 w-full border border-purple-300 rounded-full px-4 py-2" />
            <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} className="mt-4 w-full border border-purple-300 rounded-full px-4 py-2" />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button onClick={handleLogin}   className="mt-6 w-full bg-purple-700 text-white py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-purple-800 hover:shadow-[0_0_15px_rgba(168,85,247,0.8)] active:scale-95">Ingresar</button>
            <p className="text-purple-700 text-sm mt-2 cursor-pointer hover:underline" onClick={() => setModoRegistro(true)}>¿No tienes cuenta? Regístrate</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">Regístrate</h1>
            <p className="text-gray-600 text-sm mt-1">Crea tu cuenta de Administrador</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="password" placeholder="Confirmar contraseña" value={confirmarContraseña} onChange={(e) => setConfirmarContraseña(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2">
                <option value="">Tipo de documento</option>
                <option value="cc">Cédula de Ciudadanía</option>
                <option value="ti">Tarjeta de Identidad</option>
                <option value="pp">Pasaporte</option>
              </select>
              <input type="text" placeholder="Número de documento" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2 md:col-span-2" />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button onClick={handleRegister} className="mt-6 w-full bg-purple-700 text-white font-semibold py-2 rounded-full hover:bg-purple-800 transition">Registrarse</button>
            <p className="text-purple-700 text-sm mt-2 cursor-pointer hover:underline" onClick={() => setModoRegistro(false)}>¿Ya tienes cuenta? Inicia sesión</p>
          </>
        )}
      </div>
    </div>
  );
}
