import { getDB } from '../../config/db/mongoClient';
import { ObjectId } from 'mongodb';

export const getCommentsByFixer = async (fixerId: string) => {
  const db = getDB();

  return await db
    .collection('jobs')
    .aggregate([
      {
        $match: {
          fixerId: new ObjectId(fixerId),
          comment: { $exists: true, $ne: '' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'requesterId',
          foreignField: '_id',
          as: 'requester',
        },
      },
      {
        $unwind: {
          path: '$requester',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          comment: 1,
          title: 1,
          rating: 1,
          createdAt: 1,
          requesterName: '$requester.name',
        },
      },
    ])
    .toArray();
};
