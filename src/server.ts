import { SERVER_PORT } from './config/env.config';
import app from './app';
import { connectDatabase } from './config/db.config';
import { startJobsStatusCollectorCron } from './services/jobs-status-collector.cron';

//Función para iniciar el servidor (local)
async function startServer() {
  try {
    //Conectamos a la base de datos antes de iniciar el servidor
    await connectDatabase();

    //Iniciamos el servidor Express
    app.listen(SERVER_PORT, () => {
      console.info(`✅ Server running on http://localhost:${SERVER_PORT}`);
    });

    //Iniciamos el cron job para recolección de estado de jobs
    startJobsStatusCollectorCron();
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'production') {
  startServer();
}

export default app;
