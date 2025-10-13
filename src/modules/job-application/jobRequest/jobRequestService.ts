import { Db, ObjectId } from 'mongodb';
import { IRequestForm } from './requestModel.js';

interface CreateJobRequestParams {
  userId: string;
  jobMotive: string;
  jobDescription: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  startTime: string;
  endTime: string;
  suggestedRate?: number;
}

export async function createJobRequest(db: Db, params: CreateJobRequestParams) {
  const { userId, jobMotive, jobDescription, location, startTime, endTime, suggestedRate } = params;
  
  const collection = db.collection<IRequestForm>('requestforms');
  
  const newRequest = {
    userId: new ObjectId(userId),
    jobMotive,
    jobDescription, 
    location,
    startTime,
    endTime,
    suggestedRate: suggestedRate || 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await collection.insertOne(newRequest as unknown as IRequestForm);
  
  return {
    id: result.insertedId.toString(),
    userId: userId,
    jobMotive: newRequest.jobMotive,
    jobDescription: newRequest.jobDescription,
    location: newRequest.location,
    startTime: newRequest.startTime,
    endTime: newRequest.endTime,
    suggestedRate: newRequest.suggestedRate,
    createdAt: newRequest.createdAt
  };
}