// src/modules/controlC/HU4/auth/forgot.controller.ts
import { Request, Response } from "express";
import crypto from "crypto";
import clientPromise from "../../config/mongodb"; // adapta la ruta si hace falta
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"; // donde está tu app
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@servineo.example";

// Configura nodemailer (usa SMTP en .env para producción)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: !!(process.env.SMTP_SECURE === "true"),
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

function generateTokenHex(len = 32) {
  return crypto.randomBytes(len).toString("hex");
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, message: "Correo requerido" });
    }
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Correo inválido" });
    }

    const client = await clientPromise;
    const db = client.db("ServineoBD");
    const usersCol = db.collection("users");

    const user = await usersCol.findOne({ email });
    if (!user) {
      // No revelar demasiada info, pero según tus criterios queremos indicar que no está registrado
      return res.status(404).json({ success: false, message: "Correo no registrado" });
    }

    const magicCol = db.collection("magic_links");

    // 1) Rate-limit por email: no permitir nueva solicitud si existe una creada en los últimos 60s (y no usada)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recent = await magicCol.findOne({
      email,
      used: { $ne: true },
      createdAt: { $gte: oneMinuteAgo },
    });
    if (recent) {
      return res.status(429).json({
        success: false,
        message: "Ya existe una solicitud reciente. Intenta nuevamente más tarde.",
      });
    }

    // 2) Crear token (secure), guardar en DB con expiresAt = ahora + 5 minutos
    const token = generateTokenHex(32);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutos

    await magicCol.insertOne({
      token,
      email,
      createdAt: now,
      expiresAt,
      used: false,
    });

    // 3) Enviar correo con el enlace (apuntar al frontend verify page)
    const magicLink = `${FRONTEND_URL}/controlC/HU9/verify?token=${encodeURIComponent(token)}`;
    const masked = `${user.email.slice(0, 2)}${"*".repeat(Math.max(3, user.email.split("@")[0].length - 2))}@${user.email.split("@")[1]}`;

    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: "Acceso a Servineo — enlace mágico (válido 5 minutos)",
      text: `Hola,\n\nHaz clic en el siguiente enlace para ingresar a Servineo sin contraseña (válido 5 minutos):\n\n${magicLink}\n\nSi no solicitaste esto, ignora este correo.\n\n— Servineo`,
      html: `<p>Hola,</p>
             <p>Haz clic en el siguiente enlace para ingresar a Servineo sin contraseña (válido <strong>5 minutos</strong>):</p>
             <p><a href="${magicLink}">Ingresar a Servineo</a></p>
             <p>Correo: <strong>${masked}</strong></p>
             <p>Si no solicitaste esto, ignora este correo.</p>`,
    };

    // Enviar correo; si fallara, aún respondemos 200 pero logueamos el error (o devolver 500 si prefieres)
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error enviando correo magic link:", err);
      } else {
        console.log("Magic link enviado:", info?.messageId);
      }
    });

    return res.json({ success: true, message: "Enlace enviado", email: user.email });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
}

/**
 * GET /api/controlC/auth/magic-login?token=...
 * - valida token (existente, no usado, no expirado)
 * - marca used=true (single use)
 * - genera JWT de sesión y devuelve al frontend
 */
export async function magicLogin(req: Request, res: Response) {
  try {
    const token = String(req.query.token || "");
    if (!token) {
      return res.status(400).json({ success: false, message: "Token requerido" });
    }

    const client = await clientPromise;
    const db = client.db("ServineoBD");
    const magicCol = db.collection("magic_links");
    const usersCol = db.collection("users");

    // 1️⃣ Buscar el registro por token
    const record = await magicCol.findOne({ token });
    if (!record) {
      return res.status(404).json({ success: false, message: "Enlace inválido" });
    }

    const now = new Date();

    // 2️⃣ Validar expiración
    if (record.expiresAt && record.expiresAt < now) {
      return res.status(410).json({ success: false, message: "El enlace ha expirado" });
    }

    // 3️⃣ Validar que no se haya usado
    if (record.used === true) {
      return res.status(400).json({ success: false, message: "El enlace ya fue utilizado" });
    }

    // 4️⃣ Buscar el usuario correspondiente
    const user = await usersCol.findOne({ email: record.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // 5️⃣ Marcar el enlace como usado SOLO después de validar todo
    await magicCol.updateOne(
      { token },
      { $set: { used: true, usedAt: new Date() } }
    );

    // 6️⃣ Generar el token de sesión JWT
    const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
    const sessionToken = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7️⃣ Devolver respuesta
    return res.json({
      success: true,
      token: sessionToken,
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("magicLogin error:", err);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
}

