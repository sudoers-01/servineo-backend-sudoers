import { Router } from "express";
import { connectDB } from "../../config/db.config";
import { getPaymentSummaryByIdLab } from "../../controllers/lab/get-by-id-summary.controller";
import { getPaymentSummaryByJobIdLab } from "../../controllers/lab/get-by-job-summary.controller";
import { getPaymentSummaryByFixerIdLab } from "../../controllers/lab/get-by-fixer-summary.controller";
import { confirmPaymentLab } from "../../controllers/lab/confirm-payment.controller";
import { createPaymentLab, regeneratePaymentCode } from "../../controllers/lab/cashpay.controller";
import { regeneratePaymentCodeByJob } from "../../controllers/lab/regeneratecode";
import { checkCodeStatusByJob } from "../../controllers/lab/regeneratecode";

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
labRouter.post("/cashpay", createPaymentLab); // -> POST /api/lab/cashpay
labRouter.get("/payments/:id/summary", getPaymentSummaryByIdLab);
labRouter.post("/payments", createPaymentLab);
labRouter.get("/payments/by-job/:jobId/summary", getPaymentSummaryByJobIdLab);
labRouter.get("/payments/by-fixer/:fixerId/summary", getPaymentSummaryByFixerIdLab);
// Rutas actualizadas
labRouter.patch('/payments/regenerate-code/:jobId', regeneratePaymentCodeByJob);
labRouter.get('/payments/code-status/:jobId', checkCodeStatusByJob);
labRouter.patch("/payments/:id/confirm", confirmPaymentLab);
labRouter.post("/payments/:id/regenerate-code", regeneratePaymentCode);

// Exporta el router correcto ✅
export default labRouter;
