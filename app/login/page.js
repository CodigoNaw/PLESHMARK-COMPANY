"use client"; 
import Navbar from "../components/pagina inicial/Navbar";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (   
    
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/t8.png')" }}
    >

      <Navbar />

      <div className="flex justify-center">
        <div
          className="bg-white rounded-2xl shadow-lg mt-20 p-10 flex flex-col items-center border border-purple-500"
          style={{ width: "300px" }}
        >
          <Image 
            src="/Logo.png" 
            alt="Logo Pleshmark" 
            width={50} 
            height={50} 
            className="mb-4"
          />

          <h1 className="text-xl font-bold">PLESHMARK</h1>
          <p className="text-gray-600 text-sm mt-1">
            Conecta con tu futuro profesional
          </p>

          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="mt-6 w-full bg-blod-100 text-blod-700 font-medium py-2 rounded-full flex justify-between items-center px-4 border border-blod-300"
          >
            <span>Tipo de Usuario</span>
            <span>{menuAbierto ? "▲" : "▼"}</span>
          </button>

          {menuAbierto && (
            <div className="mt-4 w-full flex flex-col gap-2">
              <Link href="/usuario-login">
                <button className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition">
                  Usuario
                </button>
              </Link>
              <Link href="/empresa-login">
              <button className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition">
                Empresa
              </button>
              </Link>
              <Link href="/administrador-login">
              <button className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 transition">
                Administrador
              </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}