// src/config/server.routes.ts (o tu index.ts principal)
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"], // tu frontend
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// monta tus rutas lab
import cashpayRoutes from "../../Innosys/routes/lab/cashpay.routes";
app.use("/api/lab", cashpayRoutes);

export default app;
