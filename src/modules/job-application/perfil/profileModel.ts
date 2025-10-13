import { ObjectId } from 'mongodb';

export interface IProfile {
  _id?: ObjectId;
  userId: ObjectId;
  phone: string;
  location: {
    direction: string;
    coordinates: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  biography?: string;
  lastchange: Date;
  profilephoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
}