import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: ".env" });

import registrarDatosRouter from './modules/controlC/HU1/registrarDatos/routes';
import googleRouter from "./modules/controlC/HU3/google/routes";
import ubicacionRouter from "./modules/controlC/HU3/ubicacion/routes"; 
import authRouter from "./modules/controlC/HU4/auth/auth.routes"; 
import modificarDatosRouter from './modules/controlC/HU5/modificarDatos/routes';
import nominatimRouter from './modules/controlC/HU5/sugerencias/routes'; 
import githubAuthRouter from "./modules/controlC/HU7/routes";
import discordRoutes from "./modules/controlC/HU7/Discord/routes";
import clienteRouter from './modules/controlC/cliente/routes';



const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());


app.use("/api/controlC/google", googleRouter);
app.use("/api/controlC/ubicacion", ubicacionRouter);
app.use("/api/controlC/auth", authRouter); 
app.use('/api/controlC/registro', registrarDatosRouter);
app.use('/api/controlC/modificar-datos', modificarDatosRouter);
app.use('/api/controlC/sugerencias', nominatimRouter);
app.use("/auth", githubAuthRouter);
app.use("/auth", discordRoutes);
app.use('/api/controlC/cliente', clienteRouter);

app.listen(8000, () => console.log('Servidor corriendo en puerto 8000'));
