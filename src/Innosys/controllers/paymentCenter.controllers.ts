// En: src/controllers/paymentCenter.controllers.ts
import { Request, Response } from 'express';
import * as paymentCenterService from '../services/paymentCenter.service';
import mongoose from 'mongoose';

/**
 * Obtiene los datos del centro de pagos para el frontend.
 */
export const handleGetPaymentCenter = async (req: Request, res: Response) => {
  try {
    const { fixerId } = req.params;

    // Validación simple del ID
    if (!fixerId || !mongoose.Types.ObjectId.isValid(fixerId)) {
      return res.status(400).json({ success: false, error: "ID de Fixer inválido." });
    }

    // Llama al servicio con la lógica
    const data = await paymentCenterService.getPaymentCenterData(fixerId);

    // El frontend espera recibir { success: true, data: {...} }
    // Tu servicio ya devuelve los campos { totalGanado, trabajosCompletados }
    // Le añadimos el saldo (que manejarás en otra lógica)
    res.status(200).json({
      success: true,
      data: {
        saldoActual: 13.00, // TODO: Este valor vendrá de otra consulta (ej. Fixer Wallet)
        totalGanado: data.totalGanado,
        trabajosCompletados: data.trabajosCompletados,
        fixerId: fixerId,
      }
    });

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Error desconocido en el servidor.' });
    }
  }
};