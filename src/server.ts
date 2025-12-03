import { SERVER_PORT } from './config/env.config';
import app from './app';
import { connectDatabase } from './config/db.config';
import { startJobsStatusCollectorCron } from './services/jobs-status-collector.cron';

// 🚀 Función para iniciar el servidor
async function startServer() {
  try {
    // 🔌 1️⃣ Conectamos a la base de datos
    await connectDatabase();

    // Definimos el puerto: Prioridad a la variable PORT de la nube (Render)
    const PORT = process.env.PORT || SERVER_PORT || 8000;

    // 🚀 2️⃣ Iniciamos el servidor Express
    // IMPORTANTE: El '0.0.0.0' es obligatorio para que Render detecte el puerto
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.info(`✅ Server running on port ${PORT}`);
      console.info(`   Local access: http://localhost:${PORT}`);
    });

    // 📊 3️⃣ Iniciamos el cron job
    startJobsStatusCollectorCron();
    
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Ejecutamos la función directamente (sin condicionales de entorno)
startServer();

export default app;