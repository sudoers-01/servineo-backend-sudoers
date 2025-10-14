import { Request, Response } from "express";
import mongoose from "mongoose";
import { Payment } from "../../models/payment.model"; // ruta desde controllers/lab -> models

// POST /lab/payments  (crea pago en efectivo calculando total)
export async function createPaymentLab(req: Request, res: Response) {
  try {
    const {
      jobId,
      payerId,
      paymentMethods = "Efectivo",
      subTotal,
      service_fee,
      discount = 0,
      currency = "BOB",
      commissionRate = 0.1,
    } = req.body;

    // Calcula el total aquí (cumple la validación del schema)
    const total = Number(subTotal) + Number(service_fee) - Number(discount);

    const doc = await Payment.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      payerId: new mongoose.Types.ObjectId(payerId),
      paymentMethods,
      status: "pending",
      commissionRate,
      amount: { subTotal, service_fee, discount, total, currency },
      // code y codeExpiresAt los resuelve tu schema
    });

    return res.status(201).json({ message: "creado (lab)", data: doc });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Error creando pago (lab)" });
  }
}

