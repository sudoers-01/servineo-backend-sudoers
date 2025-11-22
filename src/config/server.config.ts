import express from "express";
import cors from "cors";

import serviciosRoutes from "../routes/servicios.routes"; 
import MainRouter from "../api/router";

const app = express();

app.use(cors());
app.use(express.json());

// Tu ruta original
app.use("/api/newoffers", serviciosRoutes);

// Rutas nuevas del PR
app.use(MainRouter);

export default app;
