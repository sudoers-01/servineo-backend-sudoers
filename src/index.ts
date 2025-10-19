import dotenv from 'dotenv';
dotenv.config();




import Server from './config/server.config';
import { connectDB } from './Innosys/config/database.config'
import { SERVER_PORT } from './config/env.config';

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import { connectDB } from './Innosys/config/database.config';


// 1. Obtener variables de entorno
const SERVER_PORT = process.env.SERVER_PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;



connectDB();

// Rutas a importar de tu aplicación
import cardRoutes from './Innosys/routes/card.routes';
import bankAccountRoutes from './Innosys/routes/BankAccount.routes'; 

// Inicializar Express
const Server = express(); // Aquí se define Server

// Middlewares
Server.use(cors());
Server.use(express.json());

// Iniciar el servidor
async function startServer() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        
        // Conexión a la base de datos
        if (!MONGODB_URI) {
            throw new Error('❌ MONGODB_URI no está definida en las variables de entorno');
        }
        await connectDB();
        
        console.log('✅ MongoDB Connected');

        // 3. Definición de RUTAS PRINCIPALES
        Server.use('/api', cardRoutes);
        Server.use('/api', bankAccountRoutes); 
        
        // --- INICIO: RUTA DE DEMO para actualizar estado (FIXER) ---
        // ESTA RUTA DEBE ESTAR DEFINIDA DESPUÉS DE LA INICIALIZACIÓN DE 'Server'
        Server.put('/api/fixers/update-state/:fixerId', (req, res) => {
            const { fixerId } = req.params;
            const { status } = req.body; // Esperamos recibir "CCB"

            // Simulación: En una app real, esto actualizaría el modelo Fixer en MongoDB
            console.log(`[DEMO] 📝 Actualizando estado del Fixer ID: ${fixerId} a: ${status}`);

            if (status === 'CCB') {
                // Simulación de éxito
                return res.status(200).json({ 
                    message: 'Estado del fixer actualizado exitosamente', 
                    fixerId: fixerId,
                    newStatus: status 
                });
            } else {
                // Simulación de error
                return res.status(400).json({ message: 'Estado no válido proporcionado.' });
            }
        });
        // --- FIN: RUTA DE DEMO ---

        // 4. Ruta de prueba (Homepage)
        Server.get('/', (req, res) => {
            res.send('Servidor Servineo-Backend corriendo...');
        });

        // 5. Iniciar el servidor
        Server.listen(SERVER_PORT, () => {
            console.log(`Server running on http://localhost:${SERVER_PORT}`);
        });

    } catch (error) {
        console.error('❌ Error starting server:', (error as Error).message);
    }
}

// Iniciar la aplicación
startServer();
