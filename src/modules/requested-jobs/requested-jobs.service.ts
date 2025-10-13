import { ObjectId } from 'mongodb';

export interface Job {
  client: string;
  description: string;
  schedule: string;
}

export async function getAllJobs() {
  return db.collection<Job>('jobs').find().toArray();
}

export async function getJobById(id: string) {
  return db.collection<Job>('jobs').findOne({ _id: new ObjectId(id) });
}

export async function createJob(job: Job) {
  const result = await db.collection<Job>('jobs').insertOne(job);
  return { ...job, _id: result.insertedId };
}
