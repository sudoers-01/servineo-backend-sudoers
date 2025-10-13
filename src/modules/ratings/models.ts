import { ObjectId } from 'mongodb';

// Modelo para la base de datos
export interface FixerRatingDoc {
  _id: ObjectId;
  fixerId: ObjectId;
  requester: ObjectId;
  avatarUrl?: string;
  score: 1 | 2 | 3;
  comment?: string;
  createdAt: Date; // Tipo Date
}

// Modelo para la respuesta al frontend
export interface FixerRatingResponse {
  id: string;
  fixerId: string;
  requester: string;
  avatarUrl?: string;
  score: 1 | 2 | 3;
  comment?: string;
  createdAt: string; // ISO string
}
