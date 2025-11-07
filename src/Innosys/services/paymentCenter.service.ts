// En: src/services/paymentCenter.service.ts
import mongoose from 'mongoose';
import Job from '../models/job.model'; // Asegúrate de que la ruta a tu modelo Job sea correcta

/**
 * Obtiene las estadísticas del centro de pagos para un Fixer.
 * @param fixerId El ID (en string) del Fixer
 */
export const getPaymentCenterData = async (fixerId: string) => {
  // 1. Convertir el string del ID a un ObjectId de MongoDB.
  // ¡Este paso es crucial porque en tu base de datos se guarda como ObjectId!
  const fixerObjectId = new mongoose.Types.ObjectId(fixerId);

  try {
    // 2. Usar un Pipeline de Agregación
    const stats = await Job.aggregate([
      {
        // 3. Fase $match: Filtra solo los jobs que nos interesan
        $match: {
          fixerId: fixerObjectId, // Coincide con el ID del fixer
          status: "Pagado"         // Y el estado es "Pagado"
        }
      },
      {
        // 4. Fase $group: Agrupa los resultados en un solo documento
        $group: {
          _id: null, // Agrupamos todo junto, sin subgrupos
          
          // 5. Calcula el "Total Ganado" sumando el campo "price"
          totalGanado: { $sum: "$price" },
          
          // 6. Calcula los "Trabajos Completados" contando los documentos
          trabajosCompletados: { $sum: 1 } // Suma 1 por cada documento
        }
      }
    ]);

    // 7. Manejar el resultado
    if (stats.length > 0) {
      // Si la agregación encontró datos, devuelve el primer elemento
      return stats[0]; 
    } else {
      // Si no se encontraron jobs "Pagado" para ese fixer
      return {
        _id: null,
        totalGanado: 0,
        trabajosCompletados: 0
      };
    }

  } catch (error) {
    console.error("Error al calcular estadísticas del centro de pagos:", error);
    throw new Error("Error al consultar los datos de pago.");
  }
};