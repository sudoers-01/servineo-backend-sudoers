import { ObjectId } from 'mongodb';

export interface FixerRatingDoc {
  _id: ObjectId;
  fixerId: ObjectId;
  requester: ObjectId;
  avatarUrl?: string;
  score: 1 | 2 | 3;
  comment?: string;
  createdAt: Date; 
}

export interface FixerRatingResponse {
  id: string;
  fixerId: string;
  requester: string;
  avatarUrl?: string;
  score: 1 | 2 | 3;
  comment?: string;
  createdAt: string; 
}
