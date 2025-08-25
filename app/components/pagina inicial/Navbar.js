import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-[#af69cd] text-white p-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/Logo.png"
          alt="Logo pleshmark"
          width={50}
          height={60}
        />
        <span className="text-3xl font-bold">PLESHMARK</span>
      </Link>

      <div className="flex gap-3">
        <Link
          href="/login"
          className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/login"
          className="bg-purple-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-800 transition"
        >
          Registrarse
        </Link>
      </div>
    </nav>
  );
}
