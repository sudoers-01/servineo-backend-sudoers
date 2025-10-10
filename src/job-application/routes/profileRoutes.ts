import express, { Request, Response } from 'express';
import authMiddleware from '../middleware/auth.js';
import { connectDB } from "../../config/db/mongoClient.js";
import { IProfile } from '../models/profileModel.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    userId: string; // El JWT contiene userId como string
  };
}

router.get('/location', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const collection = db.collection<IProfile>("profiles");
    
    // ✅ Convertir el string del JWT a ObjectId para la consulta
    const profile = await collection.findOne(
      { userId: new ObjectId(req.user?.userId) }, // string → ObjectId
      { projection: { location: 1 } }
    );

    if (!profile) {
      res.status(404).json({ msg: 'Perfil no encontrado' });
      return;
    }

    res.json(profile.location);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Error en el servidor');
  }
});

export default router;