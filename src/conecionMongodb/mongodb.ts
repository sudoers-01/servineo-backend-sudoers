import dotenv from "dotenv";
import { MongoClient, MongoClientOptions } from "mongodb";

dotenv.config({ path: ".env" });

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("⚠️ Debes definir MONGODB_URI en tu archivo .env");

const options: MongoClientOptions = {};
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Evita múltiples conexiones en modo desarrollo
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectDB() {
  const client = await clientPromise;
  return client.db("ServineoBD");
}

export default clientPromise;

