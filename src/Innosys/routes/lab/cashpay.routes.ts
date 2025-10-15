import { Router } from "express";
import { connectDB } from "../../config/db.config";
import { getPaymentSummaryByIdLab } from "../../controllers/lab/get-by-id-summary.controller";
import { getPaymentSummaryByJobIdLab } from "../../controllers/lab/get-by-job-summary.controller";
import { confirmPaymentLab } from "../../controllers/lab/confirm-payment.controller";
import { createPaymentLab } from "../../controllers/lab/cashpay.controller";

const labRouter = Router();

/** 
 * Middleware de log y conexión DB
 */
labRouter.use((req, _res, next) => {
  console.log("[LAB]", req.method, req.originalUrl);
  next();
});

const boot = connectDB().catch(err => {
  console.error("[LAB DB] error:", err?.message);
  process.exit(1);
});
labRouter.use(async (_req, _res, next) => { await boot; next(); });

/** 
 * Healthcheck para probar el router
 * GET /api/lab/health
 */
labRouter.get("/health", (_req, res) => res.json({ ok: true, where: "lab" }));

/** 
 * ENDPOINTS reales
 */

// Pago en efectivo
labRouter.post("/cashpay", createPaymentLab); // -> POST /api/lab/cashpay

// Obtener resumen por ID
labRouter.get("/payments/:id/summary", getPaymentSummaryByIdLab);

// Crear pago (otra vía, si la usas)
labRouter.post("/payments", createPaymentLab);

// Obtener resumen por jobId
labRouter.get("/payments/by-job/:jobId/summary", getPaymentSummaryByJobIdLab);

// Confirmar pago
labRouter.patch("/payments/:id/confirm", confirmPaymentLab);

// Exporta el router correcto ✅
export default labRouter;
