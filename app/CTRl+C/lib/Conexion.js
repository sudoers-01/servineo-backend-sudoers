import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Evita reconectar en cada request (recomendado por Next.js)
if (!MONGODB_URI) {
  throw new Error("⚠️ Debes definir la variable MONGODB_URI en tu archivo .env.local");
}

let isConnected = false; // bandera de conexión

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Conexión a MongoDB reutilizada");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("🚀 Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    throw new Error("No se pudo conectar a la base de datos");
  }
};
