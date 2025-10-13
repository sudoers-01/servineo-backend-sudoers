import express from 'express';
import cors from 'cors';
import AppRoutes from './server.routes.js';

const app = express();

//Midleware
app.use(cors());
app.use(express.json());

//AppRoutes ya incluye todas las rutas
app.use(AppRoutes);

export default app;
