import express from "express";
import cors from "cors";
import googleRouter from "./modules/controlC/google/routes";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/controlC/google", googleRouter);

app.listen(8000, () => console.log("Servidor corriendo en puerto 8000"));