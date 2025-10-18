import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

import googleRouter from './modules/controlC/google/routes';
import ubicacionRouter from './modules/controlC/ubicacion/routes';
// Asumo que 'registrarDatosRouter' es el router que contiene la ruta de registro manual
import registrarDatosRouter from './modules/controlC/registrarDatos/routes';

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// RUTAS CORREGIDAS
app.use('/api/controlC/google', googleRouter);
app.use('/api/controlC/ubicacion', ubicacionRouter);
// 🛑 CORREGIDO: Cambiamos el prefijo de 'registrarDatos' a 'registro'
app.use('/api/controlC/registro', registrarDatosRouter);

app.listen(8000, () => console.log('Servidor corriendo en puerto 8000'));
