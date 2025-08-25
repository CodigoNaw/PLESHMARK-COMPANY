import Image from "next/image";
import { FaInstagram, FaFacebook, FaTiktok, FaHome, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-200 border-t-4 border-purple-500 shadow-[0_-4px_15px_rgba(168,85,247,0.7)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold">l CONTACTANOS</h2>
          <p className="mt-4 text-gray-700">
            En Pleshmark resolvemos todas tus dudas. Puedes comunicarte con nosotros
            a través de nuestras redes sociales, líneas telefónicas o visitarnos
            en nuestra sede principal.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <FaHome className="text-purple-600" />
                <span>carrera 18 49 82</span>
              </p>
              <p className="flex items-center gap-2">
                <FaPhone className="text-purple-600" />
                <span>302701157 - 3006843507</span>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-purple-600" />
                <span>pleshmark@gmail.com</span>
              </p>
            </div>

            <div className="space-y-3">
              <a 
                href="https://instagram.com/pleshmarkcard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors duration-200"
              >
                <FaInstagram className="text-pink-600 text-xl" />
                <span>pleshmarkcard</span>
              </a>
              
              <a 
                href="https://facebook.com/pleshmark" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <FaFacebook className="text-blue-600 text-xl" />
                <span>pleshmark</span>
              </a>
              
              <a 
                href="https://tiktok.com/@pleshmarkfuture" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors duration-200"
              >
                <FaTiktok className="text-black text-xl" />
                <span>pleshmarkfuture</span>
              </a>
            </div>
          </div>

          {/* Sección adicional de iconos sociales grandes */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Síguenos en:</h3>
            <div className="flex space-x-6">
              <a 
                href="https://instagram.com/pleshmarkcard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 transform hover:scale-110 transition-all duration-200"
              >
                <FaInstagram size={32} />
              </a>
              
              <a 
                href="https://facebook.com/pleshmark" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-all duration-200"
              >
                <FaFacebook size={32} />
              </a>
              
              <a 
                href="https://tiktok.com/@pleshmarkfuture" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-black hover:text-gray-700 transform hover:scale-110 transition-all duration-200"
              >
                <FaTiktok size={32} />
              </a>
            </div>
          </div>
        </div>

        <div className="w-1/3 relative">
          <Image
            src="/T1.png"
            alt="Sede Pleshmark"
            fill
            className="object-cover h-full"
          />
        </div>
      </div>
 
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 text-white text-center py-3">
        © 2025 PLESHMARK. Tu futuro profesional comienza aquí.
      </div>
    </footer>
  );
}