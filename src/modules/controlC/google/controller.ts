import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyGoogleToken, checkUserExists, createUser } from "./service";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export async function googleAuth(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ status: "error", message: "Token no recibido" });
  }

  try {
    const user = await verifyGoogleToken(token);
    if (!user || !user.email) {
      return res.status(400).json({ status: "error", message: "Token inválido" });
    }

    const exists = await checkUserExists(user.email);

    // Si no existe, lo creamos
    if (!exists) {
      await createUser(user);
    }

    // Generar token de sesión (válido 7 días)
    const sessionToken = jwt.sign(
      { email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Respuesta final
    return res.json({
      status: exists ? "exists" : "firstTime",
      firstTime: !exists,
      user,
      token: sessionToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Error al autenticar con Google" });
  }
}
