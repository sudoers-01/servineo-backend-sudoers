import { Db, ObjectId } from 'mongodb';

export interface JobRequest {
  _id?: ObjectId;
  title: string;
  description: string;
  location?: {
    type: 'Point';
    coordinates: [string, string];
  };
  startTime?: string;
  endTime?: string;
  price: number;
  requesterId: ObjectId;
  fixerId: ObjectId;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'paid';
  createdAt: Date;
  rating?: number;
  comment?: string;
  type?: string;
}

export async function getAllJobRequests(db: Db) {
  return db.collection<JobRequest>('jobs').find().toArray();
}

export async function getJobRequestById(db: Db, id: string) {
  return db.collection<JobRequest>('jobs').findOne({
    _id: new ObjectId(id),
  });
}

export async function createJobRequest(
  db: Db,
  jobRequest: Omit<JobRequest, '_id' | 'requesterId' | 'fixerId' | 'status' | 'createdAt'> & {
    fixerId: string;
    price: string | number;
  },
  requesterId: string,
) {
  const jobRequestToInsert: JobRequest = {
    title: jobRequest.title,
    description: jobRequest.description,
    location: jobRequest.location,
    startTime: jobRequest.startTime,
    endTime: jobRequest.endTime,
    price: Number(jobRequest.price),
    requesterId: new ObjectId(requesterId),
    fixerId: new ObjectId(jobRequest.fixerId),
    status: 'pending',
    createdAt: new Date(),
  };

  const result = await db.collection<JobRequest>('jobs').insertOne(jobRequestToInsert);
  return { ...jobRequestToInsert, _id: result.insertedId };
}
