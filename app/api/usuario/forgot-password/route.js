import dbConnect from "@/lib/mongodb";
import Usuario from "@/models/Usuario";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await dbConnect();
    const { correo } = await req.json();

    if (!correo) {
      return new Response(
        JSON.stringify({ error: "El correo es obligatorio" }),
        { status: 400 }
      );
    }

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return new Response(
        JSON.stringify({ error: "No existe una cuenta con este correo" }),
        { status: 404 }
      );
    }

    // 🔑 Crear token con duración de 1 hora
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 📩 Configurar transporter con Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📌 URL dinámica para reset
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/usuario?token=${token}`;

    // 📧 Enviar correo
    await transporter.sendMail({
      from: `"Pleshmark" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recuperar contraseña</h2>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetUrl}" target="_blank">Recuperar contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    return new Response(
      JSON.stringify({ mensaje: "Correo de recuperación enviado" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en forgot-password usuario:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
