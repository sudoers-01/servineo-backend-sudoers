import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import AppRoutes from '../config/server.routes'; // importa tus rutas globales

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'], // tu frontend
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());
app.use('/api', AppRoutes); // prefijo global: todas las rutas empiezan con /api
=======
import AppRoutes from './server.routes.js';

const app = express();

//Midleware
app.use(cors());
app.use(express.json());

//AppRoutes ya incluye todas las rutas
app.use(AppRoutes);
>>>>>>> 3e6bba9 (add)

export default app;
