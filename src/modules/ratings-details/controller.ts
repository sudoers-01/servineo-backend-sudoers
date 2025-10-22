import { Request, Response } from 'express';
import { RatingDetailsService } from './service';

export class RatingDetailsController {
  static async getRatings(req: Request, res: Response) {
    try {
      const { fixerId } = req.params;
      const service = new RatingDetailsService(req.db);
      const ratings = await service.getRatings(fixerId);
      res.json(ratings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching fixer reviews' });
    }
  }
}
