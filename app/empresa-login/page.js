"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";


export default function EmpresaLogin() {
  const [modoRegistro, setModoRegistro] = useState(false);

  // Campos del registro
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [nit, setNit] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [tipoEmpresa, setTipoEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");

  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    if (contraseña !== confirmarContraseña) {
      return setError("Las contraseñas no coinciden");
    }
    const res = await fetch("/api/empresa/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreEmpresa, nit, direccion, correo, contraseña, tipoEmpresa, telefono }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    alert("Registro exitoso, ahora inicia sesión");
    setModoRegistro(false);
  };

const handleLogin = async () => {
  setError("");

  const res = await fetch("/api/empresa/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contraseña }),
  });

  const data = await res.json();
  if (!res.ok) return setError(data.error);

  // Guardar token
  localStorage.setItem("token", data.token);

  // Decodificar token para obtener datos del usuario
  const decoded = jwtDecode(data.token);

  // Guardar los datos del usuario en localStorage
  localStorage.setItem("userData", JSON.stringify(decoded));

  // Redirigir al dashboard
  router.push("/empresa-dashboard");
};
  return (
    <div className="min-h-screen bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: "url('/f3.png')" }}>
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center border border-purple-500" style={{ width: "400px" }}>
        <Link href="/"><Image src="/Logo.png" alt="Logo Pleshmark" width={50} height={50} className="mb-4" /></Link>

        {!modoRegistro ? (
<>
  <h1 className="text-xl font-bold">Empresas</h1>
  <p className="text-gray-600 text-sm mt-1">Ingresa con tu correo y contraseña</p>

  <input
    type="email"
    placeholder="Correo"
    value={correo}
    onChange={(e) => setCorreo(e.target.value)}
    className="mt-6 w-full border border-purple-300 rounded-full px-4 py-2"
  />

  <input
    type="password"
    placeholder="Contraseña"
    value={contraseña}
    onChange={(e) => setContraseña(e.target.value)}
    className="mt-4 w-full border border-purple-300 rounded-full px-4 py-2"
  />

  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

  <button
    onClick={handleLogin}
    className="mt-6 w-full bg-purple-700 text-white py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-purple-800 hover:shadow-[0_0_15px_rgba(168,85,247,0.8)] active:scale-95"
  >
    Ingresar
  </button>

  {/* 🔑 Aquí agregamos la opción de recuperar */}
  <p
    className="text-blue-600 text-sm mt-2 cursor-pointer hover:underline"
    onClick={() => router.push("/recuperar/[rol]")}
  >
    ¿Olvidaste tu contraseña?
  </p>

  <p
    className="text-purple-700 text-sm mt-2 cursor-pointer hover:underline"
    onClick={() => setModoRegistro(true)}
  >
    ¿Eres una empresa nueva? Regístrate
  </p>
</>

        ) : (
          <>
            <h1 className="text-xl font-bold">Regístrate</h1>
            <p className="text-gray-600 text-sm mt-1">Crea tu cuenta de Empresa</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <input type="text" placeholder="Nombre Empresa" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="text" placeholder="NIT" value={nit} onChange={(e) => setNit(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <input type="password" placeholder="Confirmar contraseña" value={confirmarContraseña} onChange={(e) => setConfirmarContraseña(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2" />
              <select value={tipoEmpresa} onChange={(e) => setTipoEmpresa(e.target.value)} className="border border-purple-300 rounded-full px-4 py-2">
                <option value="">Tipo de empresa</option>
                <option value="grande">Grande</option>
                <option value="mediana">Mediana</option>
                <option value="pequeña">Pequeña</option>
              </select>
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
