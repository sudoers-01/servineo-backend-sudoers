import mongoose from "mongoose";

export async function connectDB(uri?: string) {
  const MONGODB_URI = uri ?? process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/servineo_dev";
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  // Evita warnings por índices duplicados al levantar varias veces
  mongoose.set("strictQuery", true);

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true, // en prod podrías desactivar y crear por script
  });

  console.log(`[DB] Conectado a MongoDB: ${MONGODB_URI}`);
  return mongoose.connection;
}
