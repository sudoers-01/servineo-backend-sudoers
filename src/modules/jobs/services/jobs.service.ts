import { Db, ObjectId } from 'mongodb';

export const changeJobStatus = async (db: Db, jobId: string) => {
  const result = await db
    .collection('jobs')
    .updateOne({ _id: new ObjectId(jobId) }, { $set: { status: 'complete' } });

  if (result.matchedCount === 0) {
    throw new Error('Job not found');
  }

  return result;
};
