import dotenv from 'dotenv';
dotenv.config();

import Server from './config/server.config.js';
import { connectDB } from './Innosys/config/database.config.js'
import { SERVER_PORT } from './config/env.config.js';

async function startServer() {
  try {
    // 1. Conectar a la base de datos PRIMERO (con await)
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();

    Server.listen(SERVER_PORT, () => {
      console.info(`Server running on http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('Error starting server', error);
  }
}

startServer();
