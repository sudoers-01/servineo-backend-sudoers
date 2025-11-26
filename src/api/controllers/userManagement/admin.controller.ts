import { Request, Response } from "express";
import { connectDB } from "../../../config/db/mongoClient";
import bcrypt from "bcryptjs";
import { generarToken } from "../../../utils/generadorToken";

export const loginAdministrador = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos (email o contraseña)",
    });
  }

  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    // Buscar usuario por email dentro de authProviders
    const user = await usersCollection.findOne({
      "authProviders.provider": "email",
      "authProviders.providerId": email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado o sin método de correo vinculado",
      });
    }

    // 🔥 Validar que sea admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos de administrador",
      });
    }

    const emailProvider = user.authProviders.find(
      (p: any) => p.provider === "email" && p.providerId === email
    );

    if (!emailProvider || !emailProvider.password) {
      return res.status(400).json({
        success: false,
        message: "El método de correo no tiene contraseña registrada",
      });
    }

    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(password, emailProvider.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    const userPicture = user.url_photo || null;

    // Generar token con la misma función del proyecto
    const sessionToken = generarToken(
      user._id.toString(),
      user.name || "Administrador",
      email,
      userPicture
    );

    return res.json({
      success: true,
      message: "Inicio de sesión de administrador exitoso",
      token: sessionToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email,
        picture: userPicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión de administrador:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
