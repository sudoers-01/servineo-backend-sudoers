import { MongoClient, type Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  try {
    if (!client) {
      client = new MongoClient(uri);
    }
    await client.connect();
    db = client.db(process.env.DB_NAME);
    return db;
  } catch (error) {
    console.error('Failed to connect to the database', error);
    throw error;
  }
}

export async function closeDB(): Promise<void> {
  try {
    if (client) {
      await client.close();
      client = null;
    }
    db = null;
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

export const getDB = () => {
  if (!db) throw new Error('Database not connected');
  return db;
};
