import { Request, Response } from "express";
import { guardarUbicacion } from "./service";

export const registrarUbicacion = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Faltan coordenadas" });
    }

    await guardarUbicacion(lat, lng);

    res.json({
      message: "Ubicación registrada correctamente",
      lat,
      lng,
    });
  } catch (error) {
    console.error("Error en registrarUbicacion:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};