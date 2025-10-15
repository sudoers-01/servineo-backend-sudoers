import { Router } from 'express';


import HealthRoutes from '../modules/health/health.routes';

import LabRoutes from '../Innosys/routes/lab/cashpay.routes';

const router = Router();

// /api/healthz
router.use('/', HealthRoutes);
router.get('/healthz', (_req, res) => res.json({ ok: true }));

// /api/lab/*
router.use('/lab', LabRoutes);

//import HealthRoutes from '../modules/health/health.routes.js';
//import CardsRoutes from "../Innosys/routes/card.routes.js";
//import UsersRoutes from "../Innosys/routes/user.routes.js";
//import PaymentRoutes from "../Innosys/routes/payment.routes.js";

//import HealthRoutes from '../modules/health/health.routes';
//import CardsRoutes from "../Innosys/routes/card.routes";
//import UsersRoutes from "../Innosys/routes/user.routes";
//import PaymentRoutes from "../Innosys/routes/payment.routes";


//const router = Router();

// Debug: mostrar rutas registradas

import CardsRoutes from "../Innosys/routes/card.routes";
import UsersRoutes from "../Innosys/routes/user.routes";
import PaymentRoutes from "../Innosys/routes/payment.routes";
import CashPayRoutes from '../Innosys/routes/lab/cashpay.routes';

//const router = Router();

// Middleware de debug para ver todas las peticiones

router.use((req, res, next) => {
  console.log('📝 Ruta solicitada:', req.method, req.originalUrl);
  next();
});



//usamos las rutas
router.use('/api', HealthRoutes);
router.use("/api", CardsRoutes);
router.use("/api", UsersRoutes);
router.use("/api", PaymentRoutes);



// Ruta raíz para verificar que el servidor funciona
router.get("/", (req, res) => {
  res.json({ 
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Registrar todas las rutas bajo /api
router.use('/api', HealthRoutes);
router.use('/api', CardsRoutes);
router.use('/api', UsersRoutes);
router.use('/api', PaymentRoutes);
router.use('/api/lab', CashPayRoutes); // ← AGREGADO: Ruta del laboratorio

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
