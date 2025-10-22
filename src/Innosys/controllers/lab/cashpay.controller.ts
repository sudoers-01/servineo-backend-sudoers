import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Payment } from "../../models/payment.model";

const CODE_EXPIRATION_MS = 48 * 60 * 60 * 1000;

// Función auxiliar para generar código aleatorio
function generateRandomCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Normaliza método en inglés y acepta equivalentes en español
function normalizeMethod(v: unknown): "cash" | "qr" | "card" {
  const s = String(v ?? "").trim().toLowerCase();
  if (["cash", "efectivo"].includes(s)) return "cash";
  if (["qr"].includes(s)) return "qr";
  if (["card", "tarjeta", "tarjeta de crédito", "tarjeta de credito"].includes(s)) return "card";
  throw new Error("paymentMethods inválido (usa: cash | qr | card)");
}

// POST /lab/payments  (crea pago calculando total)
export async function createPaymentLab(req: Request, res: Response) {
  try {
    const {
      jobId,
      payerId,
      paymentMethods = "cash",
      subTotal,
      service_fee = 0,
      discount = 0,
      currency = "BOB",
      commissionRate = 0.1,
    } = req.body ?? {};

    // Validaciones básicas
    if (!jobId || !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ error: "jobId requerido y válido" });
    }
    if (Payment.schema.path("payerId")?.options.required && (!payerId || !mongoose.isValidObjectId(payerId))) {
      return res.status(400).json({ error: "payerId requerido y válido" });
    }

    const nSub = Number(subTotal);
    const nFee = Number(service_fee);
    const nDisc = Number(discount);
    if ([nSub, nFee, nDisc].some(Number.isNaN)) {
      return res.status(400).json({ error: "subTotal/service_fee/discount deben ser numéricos" });
    }
    const nComm = Number(commissionRate);
    if (Number.isNaN(nComm) || nComm < 0 || nComm > 1) {
      return res.status(400).json({ error: "commissionRate debe estar entre 0 y 1" });
    }

    const method = normalizeMethod(paymentMethods);
    const total = nSub + nFee - nDisc;

    // Generar código y fecha de expiración (48 horas)
    const code = generateRandomCode(6);
    const codeExpiresAt = new Date(Date.now() + CODE_EXPIRATION_MS);

    const doc = await Payment.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      ...(payerId ? { payerId: new mongoose.Types.ObjectId(payerId) } : {}),
      paymentMethods: method,
      status: "pending",
      commissionRate: nComm,
      code,
      codeExpiresAt,
      amount: {
        subTotal: nSub,
        service_fee: nFee,
        discount: nDisc,
        total,
        currency,
      },
    });

    return res.status(201).json({ message: "creado (lab)", data: doc });
  } catch (e: any) {
    if (e?.name === "ValidationError") {
      return res.status(400).json({ error: e.message });
    }
    if (e?.name === "CastError") {
      return res.status(400).json({ error: "ObjectId inválido en jobId/payerId" });
    }
    return res.status(500).json({ error: e?.message || "Error creando pago (lab)" });
  }
}

// GET /lab/payments/:id/summary - Obtiene resumen del pago
export async function getPaymentSummary(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID de pago inválido" });
    }

    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    // Verificar si el código expiró
    const now = new Date();
    const codeExpired = payment.codeExpiresAt && payment.codeExpiresAt < now;

    return res.status(200).json({
      data: {
        id: payment._id,
        code: codeExpired ? null : payment.code,
        codeExpired,
        codeExpiresAt: payment.codeExpiresAt,
        status: payment.status,
        amount: payment.amount,
        paymentMethods: payment.paymentMethods,
        createdAt: payment.createdAt
      }
    });

  } catch (e: any) {
    console.error("Error obteniendo resumen:", e);
    return res.status(500).json({ error: e?.message || "Error al obtener resumen" });
  }
}

// PATCH /lab/payments/:id/confirm - Confirma el pago con código
export async function confirmPaymentCode(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { code } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID de pago inválido" });
    }

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Código requerido" });
    }

    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    // Verificar si ya fue pagado
    if (payment.status === "paid") {
      return res.status(409).json({ 
        error: "Este pago ya fue confirmado anteriormente",
        status: "paid"
      });
    }

    // Verificar si el código existe
    if (!payment.code) {
      return res.status(400).json({ 
        error: "Este pago no tiene código generado. Por favor, genera uno nuevo desde la vista del cliente."
      });
    }

    // Verificar si el código expiró
    const now = new Date();
    if (payment.codeExpiresAt && payment.codeExpiresAt < now) {
      return res.status(410).json({ 
        error: "El código ha expirado. Debe generar un nuevo código.",
        expired: true,
        expiredAt: payment.codeExpiresAt
      });
    }

    // Verificar si está bloqueado por intentos fallidos
    if (payment.attemptsLocked && payment.attemptsUnlockAt && payment.attemptsUnlockAt > now) {
      const waitMinutes = Math.ceil((payment.attemptsUnlockAt.getTime() - now.getTime()) / 60000);
      return res.status(429).json({
        error: "Cuenta bloqueada por demasiados intentos fallidos",
        unlocksAt: payment.attemptsUnlockAt,
        waitMinutes
      });
    }

    // Si el bloqueo expiró, desbloquear
    if (payment.attemptsLocked && payment.attemptsUnlockAt && payment.attemptsUnlockAt <= now) {
      payment.attemptsLocked = false;
      payment.failedAttempts = 0;
      payment.attemptsUnlockAt = undefined;
    }

    // Verificar código
    const providedCode = code.toUpperCase().trim();
    const storedCode = payment.code.toUpperCase().trim();

    if (providedCode !== storedCode) {
      // Incrementar intentos fallidos
      payment.failedAttempts = (payment.failedAttempts || 0) + 1;
      const maxAttempts = 3;
      const remainingAttempts = maxAttempts - payment.failedAttempts;

      // Bloquear si alcanzó el máximo
      if (payment.failedAttempts >= maxAttempts) {
        payment.attemptsLocked = true;
        const lockMinutes = 10;
        payment.attemptsUnlockAt = new Date(now.getTime() + lockMinutes * 60000);
        await payment.save();

        return res.status(429).json({
          error: "Has superado el número máximo de intentos. La cuenta está bloqueada temporalmente.",
          unlocksAt: payment.attemptsUnlockAt,
          waitMinutes: lockMinutes
        });
      }

      await payment.save();

      return res.status(401).json({
        error: "Código inválido",
        remainingAttempts
      });
    }

    // Código correcto - Confirmar pago
    payment.status = "paid";
    payment.failedAttempts = 0;
    payment.attemptsLocked = false;
    payment.attemptsUnlockAt = undefined;
    await payment.save();

    return res.status(200).json({
      message: "Pago confirmado exitosamente",
      data: payment
    });

  } catch (e: any) {
    console.error("Error confirmando pago:", e);
    return res.status(500).json({ error: e?.message || "Error al confirmar el pago" });
  }
}

// POST /lab/payments/:id/regenerate-code - Regenera el código de pago
export async function regeneratePaymentCode(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID de pago inválido" });
    }

    const payment = await Payment.findById(id);
    
    if (!payment) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    if (payment.status === "paid") {
      return res.status(409).json({ 
        error: "Este pago ya fue confirmado. No se puede regenerar el código."
      });
    }

    // Generar nuevo código y fecha de expiración (48 horas)
    const newCode = generateRandomCode(6);
    const newExpiresAt = new Date(Date.now() + CODE_EXPIRATION_MS);

    payment.code = newCode;
    payment.codeExpiresAt = newExpiresAt;
    payment.failedAttempts = 0;
    payment.attemptsLocked = false;
    payment.attemptsUnlockAt = undefined;
    
    await payment.save();

    return res.status(200).json({
      message: "Código regenerado exitosamente",
      data: {
        code: newCode,
        expiresAt: newExpiresAt
      }
    });

  } catch (e: any) {
    console.error("Error regenerando código:", e);
    return res.status(500).json({ error: e?.message || "Error al regenerar código" });
  }
}