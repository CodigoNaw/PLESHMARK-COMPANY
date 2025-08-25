export default function Hero() {
  return (
    <section 
      className="relative h-[497px] bg-cover bg-center flex flex-col justify-center items-center text-center text-white"
      style={{ backgroundImage: "url('/hero.png')" }}
    >
            {/* Espacio blanco en la parte inferior */}
      <div className="absolute bottom-0 left-0 w-full h-[400px]"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 mb-32 mt-10">
        <h1 className="text-3xl md:text-3xl lg:text-6xl font-bold mb-6 mt-4 leading-tight">
          TU PRÓXIMO EMPLEO TE<br />
          ESTÁ ESPERANDO!
        </h1>
        <p className="text-lg md:text-xl mb-4 opacity-90">
          Conectamos el talento excepcional con las mejores oportunidades.
        </p>
        <p className="text-base md:text-lg opacity-80">
          Descubre empleos que se ajusten perfectamente a tu perfil profesional.
        </p>
      </div>

      {/* Recuadro con la información */}
      <div className="absolute bottom-0 left-0 w-full h-[65px] ">
        <div className="text-center space-y-1 gap-8 flex items-center justify-center text-white">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl shadow-2xl px-8 py-6 text-center border border-purple-400 backdrop-blur-sm bg-opacity-95 w-[350px] h-[130px] flex flex-col justify-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-3xl font-bold mb-1">42</p>
            <p className="text-3xl font-bold mb-1">Empleos Activos</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl shadow-2xl px-8 py-6 text-center border border-purple-400 backdrop-blur-sm bg-opacity-95 w-[350px] h-[130px] flex flex-col justify-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-3xl font-bold mb-1">103</p>
            <p className="text-3xl font-bold mb-1">Profesionales</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl shadow-2xl px-8 py-6 text-center border border-purple-400 backdrop-blur-sm bg-opacity-95 w-[350px] h-[130px] flex flex-col justify-center transform hover:scale-105 transition-transform duration-200">
            <p className="text-3xl font-bold mb-1">73</p>
            <p className="text-3xl font-bold mb-1">Empresas</p>
          </div>
        </div>
      </div>
    </section>
    
  );
}