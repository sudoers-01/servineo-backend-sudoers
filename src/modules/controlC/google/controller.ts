import { Request, Response } from "express";
import { verifyGoogleToken, checkUserExists, createUser } from "./service";

export async function googleAuth(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ status: "error", message: "Token no recibido" });

  try {
    const user = await verifyGoogleToken(token);
    if (!user || !user.email) return res.status(400).json({ status: "error", message: "Token inválido" });

    const exists = await checkUserExists(user.email);
    if (exists) return res.json({ status: "exists", user });

    const newUser = await createUser(user);
    return res.json({ status: "ok", user: newUser });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Error al autenticar con Google" });
  }
}
