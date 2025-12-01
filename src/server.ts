// ❌ Este archivo NO se debe usar en Vercel
// Solo para desarrollo local

import { SERVER_PORT } from './config/env.config';
import app from './app';
import { connectDatabase } from './config/db.config';
import { startJobsStatusCollectorCron } from './services/jobs-status-collector.cron';

// Solo ejecutar en desarrollo local
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  async function startServer() {
    try {
      await connectDatabase();
      app.listen(SERVER_PORT, () => {
        console.info(`✅ Server running on http://localhost:${SERVER_PORT}`);
      });
      startJobsStatusCollectorCron();
    } catch (error) {
      console.error('❌ Error starting server:', error);
      process.exit(1);
    }
  }
  startServer();
}

export default app;
