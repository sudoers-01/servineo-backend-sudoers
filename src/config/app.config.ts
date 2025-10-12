// src/config/app.config.ts
import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  port: process.env.PORT || 8000,

  //mongoUri: process.env.MONGO_URI || 'mongodb:',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/servineo_db',

  nodeEnv: process.env.NODE_ENV || 'development',

  jwtSecret: process.env.JWT_SECRET || 'servineo-jwt-secret-super-seguro-2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:8000',
};

export const appConfig = {
  mongoUri:
    ENV.MONGO_URI ||
    `mongodb+srv://${encodeURIComponent(ENV.MONGO_USER!)}:${encodeURIComponent(
      ENV.MONGO_PASS!
    )}@${ENV.MONGO_HOST}/${ENV.MONGO_DB}?retryWrites=true&w=majority&appName=${ENV.MONGO_DB}`,
  // ... otras configuraciones
};
