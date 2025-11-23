import express from 'express';
import cors from 'cors';
import HealthRoutes from './api/routes/health.routes';
import jobOfertRoutes from './api/routes/jobOfert.routes';
import newoffersRoutes from './api/routes/newOffers.routes';
import fixerRoutes from './api/routes/fixer.routes';
import userProfileRoutes from './routes/userProfile.routes';
import jobRoutes from './routes/job.routes';

import searchRoutes from './api/routes/search.routes';
import userProfileRoutes from './routes/userProfile.routes';
import photosRoutes from './routes/photos.routes';

import registrarDatosRouter from '../src/api/routes/userManagement/registrarDatos.routes';
import fotoPerfilRouter from '../src/api/routes/userManagement/fotoPerfil.routes';
import googleRouter from "../src/api/routes/userManagement/google.routes";
import ubicacionRouter from "../src/api/routes/userManagement/ubicacion.routes"; 
import authRouter from "../src/api/routes/userManagement/login.routes"; 
import modificarDatosRouter from '../src/api/routes/userManagement/modificarDatos.routes';
import nominatimRouter from '../src/api/routes/userManagement/sugerencias.routes'; 
import deviceRouter from '../src/api/routes/userManagement/device.routes';
import cambiarContrasenaRouter from '../src/api/routes/userManagement/editarContraseña.routes';
import cerrarSesionesRouter from '../src/api/routes/userManagement/cerrarSesiones.routes';
import ultimoCambioRouter from '../src/api/routes/userManagement/ultimoCambio.routes';
import githubAuthRouter from '../src/api/routes/userManagement/github.routes';
import discordRoutes from '../src/api/routes/userManagement/discord.routes';
import clienteRouter from '../src/api/routes/userManagement/cliente.routes';
import obtenerContrasenaRouter from '../src/api/routes/userManagement/obtener.routes';

const app = express();

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8082',
  'http://localhost:8000',
  'http://localhost:8081',
  process.env.FRONTEND_URL,
  '*',
];

// Configuración CORS mejorada
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8080','*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

// Middleware para logs (útil para debugging)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from ${req.headers.origin || 'no-origin'}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', HealthRoutes);
app.use('/api/devmaster', jobOfertRoutes);
app.use('/api/newOffers', newoffersRoutes);
app.use('/api/fixers', fixerRoutes);
app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/jobs', jobRoutes);
// 404 handler
app.use((req, res) => {
  console.log('Not found:', req.method, req.originalUrl);
  res.status(404).send({
    message: 'route not found',
  });
});

export default app;