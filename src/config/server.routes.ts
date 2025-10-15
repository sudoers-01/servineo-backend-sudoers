import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes';
import CardsRoutes from "../Innosys/routes/card.routes";
import UsersRoutes from "../Innosys/routes/user.routes";
import PaymentRoutes from "../Innosys/routes/payment.routes";
import LabRoutes from '../Innosys/routes/lab/cashpay.routes';

const router = Router();

// Debug: mostrar rutas registradas
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

//manejo de rutas no encontrados
router.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'route not found' });
});


export default router;
