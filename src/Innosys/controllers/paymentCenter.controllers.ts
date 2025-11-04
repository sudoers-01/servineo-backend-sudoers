import { Request, Response } from 'express';
import { PaymentCenterService } from '../services/paymentCenter.service';

/**
 * Controlador para obtener datos del centro de pagos
 */
export class PaymentCenterController {
  private paymentCenterService: PaymentCenterService;

  constructor() {
    this.paymentCenterService = new PaymentCenterService();
  }

  /**
   * Obtener datos del centro de pagos del fixer
   */
  getPaymentCenterData = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { fixerId } = req.params;

      // Validación básica
      if (!fixerId) {
        return res.status(400).json({
          success: false,
          error: 'fixerId es requerido'
        });
      }

      // Obtener datos del servicio
      const paymentData = await this.paymentCenterService.getFixerPaymentData(fixerId);

      // Si no se encuentra el fixer
      if (!paymentData) {
        return res.status(404).json({
          success: false,
          error: 'Fixer no encontrado',
          fixerId: fixerId
        });
      }

      // Respuesta exitosa
      return res.status(200).json({
        success: true,
        data: paymentData
      });

    } catch (error) {
      console.error('Error en getPaymentCenterData:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };
}
