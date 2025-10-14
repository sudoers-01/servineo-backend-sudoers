import { Request, Response } from 'express';
import * as ratingService from './rating.service';
import { ObjectId } from 'mongodb';

export async function getFixerAverage(req: Request, res: Response) {
  try {
    const { fixerId } = req.params;

    if (!fixerId) {
      return res.status(400).json({ message: 'fixerId is required' });
    }

    const result = await ratingService.getFixerAverageRating(req.db, new ObjectId(fixerId));

    if (!result) {
      return res.status(404).json({ message: 'No ratings found for this fixer' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching fixer average rating:', error);
    res.status(500).json({ message: 'Error fetching fixer average rating' });
  }
}
