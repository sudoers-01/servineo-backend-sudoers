import express from "express";
import cors from "cors";
import googleRouter from "./modules/controlC/google/routes";
import ubicacionRouter from "./modules/controlC/ubicacion/routes";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/controlC/google", googleRouter);
app.use("/api/controlC/ubicacion", ubicacionRouter);

app.listen(8000, () => console.log("Servidor corriendo en puerto 8000"));