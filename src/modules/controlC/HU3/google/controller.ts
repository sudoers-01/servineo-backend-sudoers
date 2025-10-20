import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyGoogleToken, findUserByEmail, createUser } from "./service";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export async function googleAuth(req: Request, res: Response) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ status: "error", message: "Token no recibido" });
  }

  try {
    const googleUser = await verifyGoogleToken(token);
    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ status: "error", message: "Token inválido" });
    }

    let dbUser = await findUserByEmail(googleUser.email);
    const exists = !!dbUser;

    if (!exists) {
      dbUser = await createUser(googleUser);
    }

    if (!dbUser) {
      return res.status(500).json({ status: "error", message: "Error interno al obtener el usuario" });
    }

    const sessionToken = jwt.sign(
      {
        id: dbUser._id.toHexString(), 
        email: dbUser.email,
        name: dbUser.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      status: exists ? "exists" : "firstTime",
      firstTime: !exists,
      user: {
        _id: dbUser._id.toHexString(),
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.url_photo, 
      },
      token: sessionToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Error al autenticar con Google" });
  }
}

export function verifyJWT(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}
