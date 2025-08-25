import Image from "next/image";

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 p-12">
          ¿POR QUÉ ELEGIR PLESHMARK?
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 text-lg mb-16 max-w-3xl mx-auto">
          Descubre las ventajas que nos convierten en tu mejor aliado para encontrar el trabajo ideal
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 relative">
            {/* Efecto de fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-800/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-600/5 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>
            
            <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <div className="relative overflow-hidden">
              <Image
                src="/p1.png"
                alt="Matching Inteligente"
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 relative z-10">
              <div className="pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                  Matching Inteligente
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nuestro algoritmo encuentra las oportunidades que mejor se adaptan a tu perfil, experiencia y objetivos profesionales.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 relative">
            {/* Efecto de fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-800/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-600/5 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>
            
            <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <div className="relative overflow-hidden">
              <Image
                src="/p2.png"
                alt="Proceso Rápido"
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 relative z-10">
              <div className="pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                  Proceso Rápido
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Postúlate con un clic. Nuestro sistema optimizado acelera el proceso de selección para resultados más rápidos.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 relative">
            {/* Efecto de fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-800/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-600/5 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>
            
            <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <div className="relative overflow-hidden">
              <Image
                src="/p3.png"
                alt="Empresas Confiables"
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 relative z-10">
              <div className="pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                  Empresas Confiables
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Trabajamos solo con compañías verificadas y de calidad.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 relative">
            {/* Efecto de fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-800/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-600/5 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>
            
            <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <div className="relative overflow-hidden">
              <Image
                src="/p4.png"
                alt="Diferentes Empresas"
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 relative z-10">
              <div className="pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                  Diferentes Empresas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Accede a oportunidades exclusivas en las mejores empresas del mercado, desde startups hasta corporaciones globales.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 relative">
            {/* Efecto de fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-800/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-600/5 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>
            
            <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <div className="relative overflow-hidden">
              <Image
                src="/p5.png"
                alt="Oportunidades"
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 relative z-10">
              <div className="pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                  Oportunidades
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Desde trabajos locales hasta posiciones remotas internacionales. Expande tus horizontes profesionales sin límites.
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 relative">
            {/* Efecto de fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-purple-800/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-600/5 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>
            
            <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            <div className="relative overflow-hidden">
              <Image
                src="/p6.png"
                alt="Privacidad Total"
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6 relative z-10">
              <div className="pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                  Privacidad Total
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Elige quién puede ver y usar tu información de contacto.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}