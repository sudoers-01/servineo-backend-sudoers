import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI environment variable is not defined');
}
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db(process.env.DB_NAME);
    } catch (error) {
      console.error('Failed to connect to the database', error);
      throw error;
    }
  }
  return db;
}

export async function closeDB() {
  try {
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}
