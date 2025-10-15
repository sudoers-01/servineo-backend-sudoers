import express from 'express';
import cors from 'cors';
import AppRoutes from '../config/server.routes'; // importa tus rutas globales

const app = express();

app.use(
  cors({
    origin: ['http://localhost:4000'], // tu frontend
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());

//AppRoutes ya incluye todas las rutas
app.use(AppRoutes);
app.use('/api', AppRoutes); // prefijo global: todas las rutas empiezan con /api

export default app;
