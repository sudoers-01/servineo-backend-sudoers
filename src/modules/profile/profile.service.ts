import { connectDB } from '../../config/db/mongoClient';

interface FixerAverage {
  fixerId: string;
  total: number;
  average: number;
}

export async function getAllFixersAverageRatings(): Promise<FixerAverage[]> {
  const db = await connectDB();
  const collection = db.collection('jobs');

  const pipeline = [
    {
      $match: {
        rating: { $exists: true },
        status: { $regex: /^pagado$/i }
      }
    },
    {
      $group: {
        _id: '$fixerId',
        total: { $sum: 1 },
        weightedSum: { $sum: '$rating' }
      }
    },
    {
      $project: {
        fixerId: '$_id',
        total: 1,
        average: {
          $round: [{ $divide: ['$weightedSum', '$total'] }, 1]
        },
        _id: 0
      }
    }
  ];

  return collection.aggregate<FixerAverage>(pipeline).toArray();
}