import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Payment } from "../../models/payment.model";

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
    // payerId: si tu schema lo tiene required:true, exigilo aquí también
    if (Payment.schema.path("payerId").options.required && (!payerId || !mongoose.isValidObjectId(payerId))) {
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

    const doc = await Payment.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      ...(payerId ? { payerId: new mongoose.Types.ObjectId(payerId) } : {}),
      paymentMethods: method,         // enum en inglés: 'cash' | 'qr' | 'card'
      status: "pending",
      commissionRate: nComm,
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
    // Errores de mongoose en 400 para que el front vea el motivo real
    if (e?.name === "ValidationError") {
      return res.status(400).json({ error: e.message });
    }
    if (e?.name === "CastError") {
      return res.status(400).json({ error: "ObjectId inválido en jobId/payerId" });
    }
    return res.status(500).json({ error: e?.message || "Error creando pago (lab)" });
  }
}
