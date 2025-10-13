import { Request, Response } from 'express';
import { getUserLocation } from './profileService.js';

export async function getLocationController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const location = await getUserLocation(req.db, userId);
    
    if (!location) {
      res.status(404).json({ message: 'Perfil no encontrado' });
      return;
    }

    res.json(location);
  } catch (error) {
    console.error('Error fetching user location:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}