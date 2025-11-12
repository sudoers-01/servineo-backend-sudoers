import cron from 'node-cron';
import { collectJobsStatus } from '../services/jobs-status-collector.service';

export function startJobsStatusCollectorCron(): void {
  // Cambiar el intervalo aquí: '*/10 * * * *' = cada 10 minutos
  // Formato cron: minuto hora día mes día-semana
  // Ejemplos:
  // '*/10 * * * *' = cada 10 minutos
  // '*/5 * * * *' = cada 5 minutos
  // '0 * * * *' = cada hora
  // '0 0 * * *' = cada día a medianoche
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('🔄 Ejecutando recolección de estado de jobs...');
      await collectJobsStatus();
      console.log('✅ Recolección de estado de jobs completada');
    } catch (error) {
      console.error('❌ Error en recolección de estado de jobs:', error);
    }
  });

  console.log('✅ Cron job de recolección de estado de jobs iniciado (cada 10 minutos)');
}
