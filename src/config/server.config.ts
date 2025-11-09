import express from 'express';
import cors from 'cors';
import AppRoutes from '../config/server.routes'; // importa tus rutas globales
import paymentsRouter from '../Innosys/routes/payments.qr';
import 'dotenv/config';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'], // tu frontend
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/payments', paymentsRouter); //add qr

//AppRoutes ya incluye todas las rutas
app.use(AppRoutes);
app.use('/api', AppRoutes); // prefijo global: todas las rutas empiezan con /api

//const app = express();

//Midleware
app.use(cors());
app.use(express.json());

//AppRoutes ya incluye todas las rutas
app.use(AppRoutes);

export default app;
