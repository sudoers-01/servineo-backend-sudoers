import { Db, ObjectId } from 'mongodb';
import { IProfile } from './profileModel.js';

export async function getUserLocation(db: Db, userId: string) {
  const collection = db.collection<IProfile>('profiles');
  
  const profile = await collection.findOne(
    { userId: new ObjectId(userId) },
    { projection: { location: 1 } }
  );

  return profile?.location || null;
}