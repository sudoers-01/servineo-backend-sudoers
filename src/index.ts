import dotenv from 'dotenv';
dotenv.config();

import Server from './config/server.config';

import { SERVER_PORT } from './config/env.config';

import { connectDB } from './config/db/mongoClient';

async function startServer() {
  try {
    await connectDB()
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
      });

    Server.listen(SERVER_PORT, () => {
      console.info(`Server running on http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('Error starting server', error);
  }
}

startServer();
