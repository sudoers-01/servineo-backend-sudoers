import { Request, Response } from "express";
import { cambiarContrasenaService } from "./service";

export const cambiarContrasena = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No autorizado" });

  const token = authHeader.split(" ")[1];
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validaciones básicas
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ 
      success: false,
      message: "Todos los campos son obligatorios" 
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ 
      success: false,
      message: "Las contraseñas no coinciden" 
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ 
      success: false,
      message: "La nueva contraseña debe tener al menos 8 caracteres" 
    });
  }

  try {
    const result = await cambiarContrasenaService(token, { currentPassword, newPassword });
    res.json(result);
  } catch (error: any) {
    // Manejo específico para contraseña incorrecta
    if ((error as any).code === "CURRENT_PASSWORD_INVALID") {
      return res.status(400).json({
        success: false,
        error: "CURRENT_PASSWORD_INVALID",
        message: "La contraseña actual es incorrecta",
      });
    }

    // Error por defecto
    res.status(400).json({ 
      success: false,
      message: error.message || "Error al cambiar la contraseña"
    });
  }
};