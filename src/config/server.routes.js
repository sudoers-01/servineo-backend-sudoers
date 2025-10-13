import { Router } from 'express';
import HealthRoutes from '../modules/health/health.routes.js';
import CardsRoutes from "../Innosys/routes/card.routes.js";
import UsersRoutes from "../Innosys/routes/user.routes.js";
import PaymentRoutes from "../Innosys/routes/payment.routes.js";

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
  res.status(404).send({
    message: 'route not found',
  });
});


export default router;
