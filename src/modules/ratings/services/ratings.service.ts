import { Db, ObjectId, type Document } from 'mongodb';
import { getDb } from '../../config/db';
import { FixerRatingDoc, FixerRatingResponse } from '../models';

export async function getFixerRatingsService(
  fixerId: ObjectId
): Promise<FixerRatingResponse[]> {
  const db: Db = await getDb();
  const ratings = db.collection<FixerRatingDoc>('ratings');

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
