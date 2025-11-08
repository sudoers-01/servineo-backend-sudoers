// src/config/server.config.ts
// ESTE ES AHORA EL ARCHIVO DE ARRANQUE PRINCIPAL

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../Innosys/config/database.config';
import { SERVER_PORT } from './env.config'; 

// Importaciones de Rutas
import AppRoutes from '../config/server.routes'; 
import paymentsRouter from '../Innosys/routes/payments.qr';
import invoiceRoutes from '../Innosys/routes/invoice.routes'; // LA IMPORTACIÓN CLAVE

dotenv.config();

const app = express();

// --- MIDDLEWARES ---
app.use(
    cors({
        origin: ['http://localhost:3000'], 
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    })
);

app.use(express.json());


// --- REGISTRO DE RUTAS ---

app.use('/api/payments', paymentsRouter); 

// ===================================================
// [SOLUCIÓN AL ERROR 404]
// La ruta de facturación debe registrarse con el prefijo /api/v1
// ===================================================
app.use('/api/v1/invoices', invoiceRoutes);

// Rutas generales
app.use(AppRoutes);
app.use('/api', AppRoutes); 


// ===================================================
// LÓGICA DE ARRANQUE (MOVIDA DE index.ts)
// ===================================================

async function startApp() {
    try {
        console.log('🔗 Conectando a MongoDB...');
        await connectDB();
        console.log('✅ Base de datos conectada.');

        app.listen(SERVER_PORT, () => {
            console.log(`Server corriendo en http://localhost:${SERVER_PORT}`);
        });

    } catch (error) {
        console.error('❌ Error al iniciar la aplicación:', error);
        process.exit(1); 
    }
}

// Iniciar la aplicación
startApp(); 

export default app;
