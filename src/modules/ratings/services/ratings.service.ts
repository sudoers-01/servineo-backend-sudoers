// src/modules/ratings/services/ratings.service.ts
import { Db, ObjectId, type Document } from 'mongodb'; // 👈 añade Document
import { getDb } from '../../config/db';

interface FixerRatingDoc {
  _id: ObjectId;
  fixerId: ObjectId;
  requester: ObjectId;
  avatarUrl?: string;
  score: 1 | 2 | 3;
  comment?: string;
  createdAt: Date;
}

export interface FixerRatingResponse {
  id: string;
  fixerId: string;
  requester: string;
  avatarUrl?: string;
  score: 1 | 2 | 3;
  comment?: string;
  createdAt: string; // ISO
}

export async function getFixerRatingsService(
  fixerId: ObjectId
): Promise<FixerRatingResponse[]> {
  const db: Db = await getDb();
  const ratings = db.collection<FixerRatingDoc>('ratings');

  // 👇 TIPAR como Document[] y NO usar "as const"
  const pipeline: Document[] = [
    { $match: { fixerId } },
    {
      $lookup: {
        from: 'users',
        localField: 'requester',
        foreignField: '_id',
        as: 'requesterData',
      },
    },
    { $unwind: '$requesterData' },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 0,
        id: { $toString: '$_id' },
        fixerId: { $toString: '$fixerId' },
        requester: '$requesterData.name',
        avatarUrl: '$requesterData.avatarUrl',
        score: 1,
        comment: 1,
        createdAt: {
          $dateToString: { date: '$createdAt', format: '%Y-%m-%dT%H:%M:%S.%LZ' },
        },
      },
    },
  ];

  return ratings.aggregate<FixerRatingResponse>(pipeline).toArray();
}
