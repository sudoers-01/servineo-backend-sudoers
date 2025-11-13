import { Router } from 'express';

// Importaciones de otros módulos
import HealthRoutes from '../models/health/health.routes';
import CardsRoutes from "../api/routes/card.routes";
import UsersRoutes from "../api/routes/user.routes";
import PaymentRoutes from "../api/routes/payment.routes";
import CashPayRoutes from '../api/routes/cashpay.routes';
import BankAccountRoutes from '../api/routes/BankAccount.routes';
import paymentsRouter from "../api/routes/payments.qr";
import PaymentCenterRoutes from '../api/routes/paymentCenter.routes'; 
import jobsRoutes from '../api/routes/jobs.routes'; 
import invoiceDetailRouter from '../api/routes/invoice.routes'; 
import bankTransferRoutes from '../api/routes/bankTransferRoute';
import  rechargeWallet  from '../api/routes/wallet.routes';
import { FEATURE_DEV_WALLET } from '../models/featureFlags';
import { devWalletRouter } from '../api/routes/dev-wallet';
import { FEATURE_SIM_PAYMENTS } from '../models/featureFlags';
import { simPaymentsRouter } from '../api/routes/sim-payments';
import { FEATURE_NOTIFICATIONS } from '../models/featureFlags';



console.log('FEATURE_NOTIFICATIONS =', FEATURE_NOTIFICATIONS);

const router = Router();

// Middleware de debug para ver todas las peticiones
router.use((req, res, next) => {
    console.log('📝 Ruta solicitada:', req.method, req.originalUrl);
    next();
});

// Ruta raíz para verificar que el servidor funciona
router.get("/", (req, res) => {
    res.json({ 
        message: "Servidor funcionando correctamente",
        timestamp: new Date().toISOString()
    });
});

// Registrar todas las rutas (montajes del equipo)

router.use('/api', HealthRoutes);
router.use('/api', CardsRoutes);
router.use('/api', UsersRoutes);
router.use('/api', PaymentRoutes);
router.use('/api', BankAccountRoutes); 
router.use('/api/lab', CashPayRoutes);
//fixerwallet
router.use("/api", rechargeWallet);
//ruta para traer trabajos
router.use('/api', jobsRoutes); 
//rutas para tranfeenrecnias
router.use('/api/transferencia-bancaria', bankTransferRoutes); //transferencia bancaria ..pasar
// 🟢 [MONTAJE CRÍTICO FUSIONADO] Usamos TU router (invoiceDetailRouter)
// Montamos TU router de detalle bajo el prefijo exacto: /api/v1/invoices
router.use('/api/v1/invoices', invoiceDetailRouter); 


// Rutas de Payment Center - Centro de Pagos del Fixer
router.use('/api/fixer/payment-center', PaymentCenterRoutes); 

// Rutas de pagos QR
router.use("/payments", paymentsRouter);

console.log('FEATURE_DEV_WALLET =', FEATURE_DEV_WALLET);
if (FEATURE_DEV_WALLET) {
  console.log('MOUNT /api/dev ✅');
  router.use('/api/dev', devWalletRouter);
}

//flags real 
if (FEATURE_SIM_PAYMENTS) {
    router.use('/api/sim', simPaymentsRouter); // => /api/sim/payments/...
}

// Manejo de rutas no encontradas (404)
router.use((req, res) => {
    console.log('❌ Not found:', req.method, req.originalUrl);
    res.status(404).json({ 
        message: 'route not found',
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

export default router;