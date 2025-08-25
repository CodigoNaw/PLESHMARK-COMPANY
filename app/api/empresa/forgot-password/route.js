// app/api/empresa/forgot-password/route.js
export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Empresa from "@/models/Empresa";
import Administrador from "@/models/Administrador";
import Usuario from "@/models/Usuario";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { correo } = await req.json();

    if (!correo) {
      return new Response(JSON.stringify({ error: "El correo es obligatorio" }), { status: 400 });
    }

    // 1) Buscar el correo en cualquiera de las colecciones (para no duplicar lógica)
    const [empresa, admin, usuario] = await Promise.all([
      Empresa.findOne({ correo }),
      Administrador.findOne({ correo }),
      Usuario.findOne({ correo }),
    ]);
    const user = empresa || admin || usuario;

    // 2) Por seguridad, no revelamos si existe o no: siempre respondemos 200
    if (user) {
      const token = jwt.sign(
        { id: user._id, rol: empresa ? "empresa" : admin ? "administrador" : "usuario" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // token válido por 15 minutos
      );

      const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      // Para el flujo de empresa usamos esta ruta del frontend:
      const resetUrl = `${origin}/empresa-reset?token=${token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // companypleshmark@gmail.com
          pass: process.env.EMAIL_PASS, // tu App Password de 16 caracteres
        },
      });

      await transporter.sendMail({
        from: `"PLESHMARK COMPANY" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: "Recupera tu contraseña",
        html: `
          <p>Hola,</p>
          <p>Solicitaste restablecer tu contraseña. Te pedimos porfavor ser cuidadoso con tu contraseña.Este enlace es válido por 15 minutos:</p>
          <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
          <p>Si no realizaste esta solicitud, ignora este mensaje.</p>
        `,
      });
    }

    return new Response(
      JSON.stringify({ mensaje: "Si el correo existe, enviamos un enlace de recuperación." }),
      { status: 200 }
    );
  } catch (e) {
    console.error("Error en /empresa/forgot-password:", e);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
