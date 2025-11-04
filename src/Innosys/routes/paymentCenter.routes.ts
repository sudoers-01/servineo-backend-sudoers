import { Router } from 'express';
import { PaymentCenterController } from '../controllers/paymentCenter.controllers';

const router = Router();
const paymentCenterController = new PaymentCenterController();

/**
 * @route   GET /api/fixer/payment-center/:fixerId
 * @desc    Obtener información del centro de pagos del fixer
 * @access  Private (requiere autenticación del fixer)
 */
router.get('/:fixerId', paymentCenterController.getPaymentCenterData);

export default router;