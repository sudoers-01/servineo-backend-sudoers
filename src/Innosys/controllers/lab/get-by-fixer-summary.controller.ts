import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Payment } from "../../models/payment.model";

type FixerSummaryDoc = {
  _id: mongoose.Types.ObjectId;
  fixerId: mongoose.Types.ObjectId;
  status: "paid" | "pending" | "failed";
  codeExpiresAt?: Date | null;
  amount: { total: number; currency: string };
};

export async function getPaymentSummaryByFixerIdLab(req: Request, res: Response) {
  try {
    const { fixerId } = req.params;
    if (!mongoose.isValidObjectId(fixerId)) {
      return res.status(400).json({ error: "fixerId inválido" });
    }

    // Filtro por estado (por defecto: pending = "monto a cobrar")
    const qs = (req.query?.status as string | undefined)?.toLowerCase();
    const statusFilter = qs && ["paid", "pending", "failed"].includes(qs) ? qs : "pending";

    const docs = await Payment.find({
      fixerId: new mongoose.Types.ObjectId(fixerId),
      ...(statusFilter ? { status: statusFilter } : {}),
    })
      .sort({ createdAt: -1 })
      .select({ "amount.total": 1, "amount.currency": 1, status: 1, codeExpiresAt: 1, _id: 1, fixerId: 1 })
      .lean<FixerSummaryDoc[]>();

    if (!docs || docs.length === 0) {
      return res.status(404).json({ error: "no encontrado" });
    }

    const data = docs.map((doc) => ({
      id: String(doc._id),
      total: doc.amount.total,
      currency: doc.amount.currency ?? "BOB",
      status: doc.status,
      codeExpiresAt: doc.codeExpiresAt ?? null,
    }));

    return res.json({ data });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Error summary por fixerId (lab)" });
  }
}
