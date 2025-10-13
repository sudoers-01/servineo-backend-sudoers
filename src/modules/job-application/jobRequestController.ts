import { Request, Response } from 'express';
import { createJobRequest } from './jobRequestService.js';

export async function createJobRequestController(req: Request, res: Response) {
  try {
    const { jobMotive, jobDescription, location, startTime, endTime, suggestedRate } = req.body;
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const result = await createJobRequest(req.db, {
      userId,
      jobMotive,
      jobDescription, 
      location,
      startTime,
      endTime,
      suggestedRate
    });
    
    res.status(201).json({ 
      message: "Solicitud creada exitosamente", 
      data: result 
    });
  } catch (error) {
    console.error("Error al guardar la solicitud:", error);
    res.status(500).json({ message: "Error al guardar la solicitud" });
  }
}