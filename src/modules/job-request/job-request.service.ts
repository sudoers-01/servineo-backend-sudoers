import { Db, ObjectId } from 'mongodb';

export interface JobRequest {
  _id?: ObjectId;
  jobMotive: string;
  jobDescription: string;
  location: {
    type: 'Point';
    coordinates: [string, string];
  };
  startTime: string;
  endTime: string;
  suggestedPrice: number;
  id_requester: ObjectId;
  id_fixer: ObjectId;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
}

export async function getAllJobRequests(db: Db) {
  return db.collection<JobRequest>('job_requests').find().toArray();
}

export async function getJobRequestById(db: Db, id: string) {
  return db.collection<JobRequest>('job_requests').findOne({
    _id: new ObjectId(id),
  });
}

export async function createJobRequest(
  db: Db,
  jobRequest: Omit<JobRequest, '_id' | 'id_requester' | 'status' | 'createdAt'>,
  requesterId: string,
) {
  const jobRequestToInsert: JobRequest = {
    ...jobRequest,
    id_requester: new ObjectId(requesterId),
    id_fixer: new ObjectId(jobRequest.id_fixer),
    status: 'pending',
    createdAt: new Date(),
  };

  const result = await db.collection<JobRequest>('job_requests').insertOne(jobRequestToInsert);
  return { ...jobRequestToInsert, _id: result.insertedId };
}
