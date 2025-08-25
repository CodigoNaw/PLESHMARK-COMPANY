import Image from "next/image";

export default function Vacancies() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          ALGUNAS DE NUESTRAS OFERTAS
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          

<div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border-b-4 border-purple-500 shadow-[0_4px_10px_rgba(168,85,247,0.9)]">            <Image
              src="/N1.png"
              alt="Matching Inteligente"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-bold-700">DISTRIBUIDORA PALERMO</h3>
              <p className="mt-2 text-gray-600">
               Una de las mejores distribuidores del sector de teusaquillo con la mejor calidad de ambiente para su trabajadores
              </p>
            </div>
          </div>


<div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border-b-4 border-purple-500 shadow-[0_4px_10px_rgba(168,85,247,0.9)]">            <Image
              src="/N2.png"
              alt="Proceso Rápido"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-bold-700">CREPPES AND WAFERS</h3>
              <p className="mt-2 text-gray-600">
                Crepes & Waffles es una cadena de restaurantes colombiana creada en 1980 en la ciudad de Bogotá por dos estudiantes del Colegio de Estudios Superiores de Administración.
              </p>
            </div>
          </div>


<div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border-b-4 border-purple-500 shadow-[0_4px_10px_rgba(168,85,247,0.9)]">            <Image
              src="/N3.png"
              alt="Empresas Confiables"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-bold-700">CINE COLOMBIA</h3>
              <p className="mt-2 text-gray-600">
                Cine Colombia es la compañía de exhibición y distribución de películas más grande de Colombia, fundada en 1927. 
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
