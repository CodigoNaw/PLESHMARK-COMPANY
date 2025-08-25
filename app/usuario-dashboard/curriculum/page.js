"use client";
import { useState, useEffect } from "react";
import { getUserData } from "@/utils/getUserData";

export default function CurriculumUsuario() {
  const [user, setUser] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserData();
      setUser(data);
      setPdfUrl(data.pdfCurriculum || "");
    };
    fetchUser();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user._id);

    const res = await fetch("/api/usuario/upload-cv", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setPdfUrl(data.url);
      alert("Currículum subido con éxito ✅");
    } else {
      alert("Error al subir currículum ❌");
    }
  };

  return (
    <div className="p-6">
      {user && (
        <>
          <h2 className="text-2xl font-bold mb-4">Mi Currículum</h2>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Correo:</strong> {user.correo}</p>
          <p><strong>Especialidad:</strong> {user.especialidad}</p>

          <div className="mt-6">
            <label className="block mb-2 font-semibold">Subir PDF:</label>
            <input type="file" accept="application/pdf" onChange={handleUpload} />

            {pdfUrl && (
              <div className="mt-4">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                >
                  Ver / Descargar CV
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
