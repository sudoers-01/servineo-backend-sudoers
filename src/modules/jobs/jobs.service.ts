import { Db } from 'mongodb';

export async function getCompletedJobs(db: Db) {
  const jobsCollection = db.collection('jobs');
  const jobs = await jobsCollection.find({ status: 'completed' }).toArray();

  return jobs.map((job) => ({
    id: job._id.toString(),
    name: job.title,
    date: new Date(job.createdAt).toLocaleDateString(),
    status: job.status,
  }));
}