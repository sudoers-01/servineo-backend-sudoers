import { Db, ObjectId } from 'mongodb'
import { getDb } from '../../config/db'

interface FixerRating {
  _id: ObjectId
  fixerId: ObjectId
  requester: ObjectId
  avatarUrl?: string
  score: 1 | 2 | 3 | 4 | 5
  comment?: string
  createdAt: string
}

interface FixerRatingResponse {
  id: string
  fixerId: string
  requester: string
  avatarUrl?: string
  score: 1 | 2 | 3 | 4 | 5
  comment?: string
  createdAt: string
}

export async function getFixerRatingsService(
  fixerId: ObjectId
): Promise<FixerRatingResponse[]> {
  const db: Db = await getDb()
  const ratingsCollection = db.collection<FixerRating>('ratings')

  const ratings = await ratingsCollection
    .aggregate<FixerRatingResponse>([
      { $match: { fixerId } },
      {
        $lookup: {
          from: 'users',
          localField: 'requester',
          foreignField: '_id',
          as: 'requesterData'
        }
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
          createdAt: 1
        }
      }
    ])
    .toArray()

  return ratings
}
