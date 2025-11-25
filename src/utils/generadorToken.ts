import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "super_secret_key";

export function generarToken(
  id: string,
  name: string,
  email: string,
  picture?: string, // Puedes dejar el argumento si lo usas en otro lado, pero no lo metas al payload
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  
  // ✅ CORRECCIÓN: Quitamos 'picture' del payload.
  // El token ahora será ligero y rápido.
  const payload = { id, name, email }; 
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verificarToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}