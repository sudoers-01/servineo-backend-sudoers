import clientPromise from '../../config/db/mongodb';
import { ObjectId } from 'mongodb';

interface ManualUser {
  email: string;
  name: string;
  picture?: string;
  password: string 
}

interface InsertedUser {
  email: string;
  name: string;
}

export async function checkUserExists(email: string): Promise<boolean> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db('ServineoBD');

  const user = await db.collection('users').findOne({
    providers: { $elemMatch: { email } }
  });

  return !!user;
}

export async function createManualUser(user: ManualUser): Promise<InsertedUser & { _id: string; picture?: string }> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db('ServineoBD');

  const result = await db.collection('users').insertOne({
    name: user.name,
    email: user.email,
    url_photo: user.picture || 'no hay',
    role: 'requester',
    especialidad: '',
    telefono: '',
    certificacion: '',
    language: 'es',
    createdAt: new Date(),
    authProviders: [
      {
        provider: "email",
        email: user.email,
        passwordHash: user.password,
        linkedAt: new Date(),
      },
    ],
  });

  console.log('Usuario manual insertado en MongoDB (con providers):', user.email);

  return {
    _id: result.insertedId.toHexString(),
    name: user.name,
    email: user.email,
    picture: user.picture || 'no hay',
  };
}

export async function getUserById(usuarioId: string): Promise<any | null> {
  const mongoClient = await clientPromise;
  const db = mongoClient.db('ServineoBD');

  const user = await db.collection('users').findOne({ _id: new ObjectId(usuarioId) });
  return user;
}