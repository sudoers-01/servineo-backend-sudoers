import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Payment } from "../../models/payment.model";

type PaymentSummary = {
  _id: mongoose.Types.ObjectId;
  code: string;
  status: "paid" | "pending" | "failed";
  codeExpiresAt?: Date;
  amount: { total: number; currency: string };
};

export async function getPaymentSummaryByIdLab(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "id inválido" });
    }

    const doc = await Payment.findById(id)
      .select({ "amount.total": 1, "amount.currency": 1, code: 1, status: 1, codeExpiresAt: 1 })
      .lean<PaymentSummary>();

    if (!doc) return res.status(404).json({ error: "no encontrado" });

    if (typeof doc?.amount?.total !== "number") {
      return res.status(422).json({ error: "documento sin 'amount.total' válido" });
    }

    return res.json({
      data: {
        id,
        code: doc.code,
        total: doc.amount.total,
        status: doc.status,
        expiresAt: doc.codeExpiresAt ?? null,
        currency: doc.amount.currency ?? "BOB",
      },
    });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Error buscando resumen por id (lab)" });
  }
}
