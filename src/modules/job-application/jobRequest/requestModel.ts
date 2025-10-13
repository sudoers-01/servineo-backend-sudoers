import { ObjectId } from 'mongodb';
export interface IRequestForm {
  _id?: ObjectId;
  jobMotive: string;
  jobDescription: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  startTime: string;
  endTime: string;
  suggestedRate: number;
  createdAt: Date;
  updatedAt: Date;
}
