import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "super_secret_key";

export function generarToken(
  id: string,
  nombre: string,
  email: string,
  picture?: string,
  message: string = "hola",
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  const payload = { id, nombre, email, picture, message };
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verificarToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}