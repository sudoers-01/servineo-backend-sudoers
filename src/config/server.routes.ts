// ============================================
// ARCHIVO: src/config/server.routes.ts
// ============================================

import { Router } from 'express';

import HealthRoutes from '../modules/health/health.routes';
import CardsRoutes from "../Innosys/routes/card.routes";
import UsersRoutes from "../Innosys/routes/user.routes";
import PaymentRoutes from "../Innosys/routes/payment.routes";
import CashPayRoutes from '../Innosys/routes/lab/cashpay.routes';
import BankAccountRoutes from '../Innosys/routes/BankAccount.routes';
import paymentsRouter from "../Innosys/routes/payments.qr";
import PaymentCenterRoutes from '../Innosys/routes/paymentCenter.routes'; 

// [CORRECCIÓN/VERIFICACIÓN CRÍTICA] 1. Importación de Rutas de Facturas
// Se asume que el archivo es 'invoicelist.routes.ts' y la ruta es correcta.
import InvoiceListRoutes from '../Innosys/routes/invoicelist.routes'; 

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

// Registrar todas las rutas
// Nota: Tu configuración actual monta muchas rutas directamente bajo /api,
// pero esto funciona si los routers internos no tienen prefijos.
router.use('/api', HealthRoutes);
router.use('/api', CardsRoutes);
router.use('/api', UsersRoutes);
router.use('/api', PaymentRoutes);
router.use('/api', BankAccountRoutes); 
router.use('/api/lab', CashPayRoutes);


// 🟢 [MONTAJE CRÍTICO] 2. Montaje de Rutas de Facturas
// Montamos el router de facturas bajo el prefijo exacto que necesita el Frontend: /api/v1/invoices
// El router interno (invoicelist.routes.ts) ya define / y /:id.
router.use('/api/v1/invoices', InvoiceListRoutes); 


// Rutas de Payment Center - Centro de Pagos del Fixer
router.use('/api/fixer/payment-center', PaymentCenterRoutes); 

// Rutas de pagos QR
// Usar un solo punto de montaje es más limpio. Asumo que el /payments es el correcto.
router.use("/payments", paymentsRouter);
// router.use("api/payments", paymentsRouter); // 🚫 Eliminamos este duplicado para evitar conflictos

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