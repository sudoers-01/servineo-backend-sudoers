import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

import googleRouter from "./modules/controlC/HU3/google/routes";
import ubicacionRouter from "./modules/controlC/HU3/ubicacion/routes"; 
import authRouter from "./modules/controlC/HU4/auth/auth.routes"; 

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());


app.use("/api/controlC/google", googleRouter);
app.use("/api/controlC/ubicacion", ubicacionRouter);
app.use("/api/controlC/auth", authRouter); 

app.listen(8000, () => console.log("Servidor corriendo en puerto 8000"));