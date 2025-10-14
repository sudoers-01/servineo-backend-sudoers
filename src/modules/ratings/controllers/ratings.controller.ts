import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../../config/db';
import { getFixerRatingsService } from '../services/ratings.service';

export async function getFixerRatingsController(req: Request, res: Response) {
  try {
    const { fixerId } = req.params;

    if (!ObjectId.isValid(fixerId)) {
      return res.status(400).json({ message: 'Invalid fixerId' });
    }

    const db = await getDb();
    const ratings = await getFixerRatingsService(new ObjectId(fixerId), db);
    return res.status(200).json(ratings ?? []);
  } catch (error) {
    console.error('[GET /fixers/:fixerId/ratings]', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
