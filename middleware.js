import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // Si no hay token, mandar a login
  if (!token) {
    return NextResponse.redirect(new URL("/usuario-login", req.url));
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { pathname } = req.nextUrl;

    // Si está intentando entrar a /admin pero no es admin
    if (pathname.startsWith("/admin") && decoded.rol !== "admin") {
      return NextResponse.redirect(new URL("/usuario", req.url));
    }

    // Si está intentando entrar a /usuario pero no es usuario
    if (pathname.startsWith("/usuario") && decoded.rol !== "usuario") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error verificando token:", error);
    return NextResponse.redirect(new URL("/usuario-login", req.url));
  }
}

// Definir en qué rutas se aplica el middleware
export const config = {
  matcher: ["/admin/:path*", "/usuario/:path*"],
};
