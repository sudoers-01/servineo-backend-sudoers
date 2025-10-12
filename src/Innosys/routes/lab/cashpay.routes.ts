import { Router } from "express";
import { getPaymentSummaryByIdLab } from "../../controllers/lab/get-by-id-summary.controller";
import { connectDB } from "../../config/db.config"; // ⬅️ IMPORTA TU CONNECTOR
import { getPaymentSummaryByJobIdLab } from "../../controllers/lab/get-by-job-summary.controller";
import { confirmPaymentLab } from "../../controllers/lab/confirm-payment.controller";
import {
  createPaymentLab,
  getPaymentByIdLab,
  getPaymentByCodeLab,
} from "../../controllers/lab/cashpay.controller";


const labRouter = Router();
labRouter.use((req, _res, next) => {
  console.log("[LAB]", req.method, req.originalUrl);
  next();
});
/** 
 * Conecta a Mongo **una sola vez** cuando se cargue este router.
 * Todas las rutas esperarán a que 'boot' termine antes de atender.
 */
const boot = connectDB().catch(err => {
  console.error("[LAB DB] error:", err?.message);
  process.exit(1);
});

// middleware que asegura la conexión antes de cada handler
labRouter.use(async (_req, _res, next) => { await boot; next(); });

// Health simple (útil para probar que el router responde)
labRouter.get("/health", (_req, res) => res.json({ ok: true, where: "lab" }));

// Tus endpoints:
labRouter.get("/payments/:id/summary", getPaymentSummaryByIdLab);
labRouter.post("/payments", createPaymentLab);
labRouter.get("/payments/:id", getPaymentByIdLab);
labRouter.get("/payments/by-code/:code", getPaymentByCodeLab);
labRouter.get("/payments/by-job/:jobId/summary", getPaymentSummaryByJobIdLab);
labRouter.patch("/payments/:id/confirm", confirmPaymentLab);
export default labRouter;
