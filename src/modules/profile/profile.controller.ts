import { Request, Response } from 'express';
import { getDB as db } from '../../config/db/mongoClient';
import { ObjectId } from 'mongodb';
import { getAllFixersAverageRatings } from './profile.service';

export async function getProfileData(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing user ID' });
  }
  if (!(ObjectId.isValid(id) && new ObjectId(id).toHexString() === id)) {
    return res.status(422).json({ error: 'Invalid user ID format' });
  }

  try {
    const usersCollection = db().collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      name: user.name,
      photo_url: user.url_photo,
      role: user.role,
      average_rating: user.average_rating || 1.5,
      ratings: user.ratings || { 1: 14, 2: 4, 3: 1 },
      rating_count: user.rating_count || 19,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAllFixersAverage(_req: Request, res: Response) {
  try {
    const data = await getAllFixersAverageRatings();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching all fixers averages:', error);
    return res.status(500).json({ message: 'Error fetching all fixers averages' });
  }
}
