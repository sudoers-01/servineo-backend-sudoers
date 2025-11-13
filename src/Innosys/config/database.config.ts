//src/Innosys/config/database.config.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//cargar variables de entorno primero
dotenv.config();

export const connectDB = async () => {
  try {
    const options = {
      // Opciones de conexión
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout después de 5s
      socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI!, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

    // Event listeners para debugging
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', (error as Error).message);
    process.exit(1); // Salir con error
  }
};

// Función para cerrar la conexión (útil para tests)
//aunque mongdb ya maneja automaticamente las conexiones
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', (error as Error).message);
  }
};

export {closeDB};