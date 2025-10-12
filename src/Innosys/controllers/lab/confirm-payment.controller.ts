import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Payment } from "../../models/payment.model";

export async function confirmPaymentLab(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { code } = (req.body || {}) as { code?: string };

    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "id inválido" });
    if (!code) return res.status(400).json({ error: "code requerido" });

    const pay = await Payment.findById(id);
    if (!pay) return res.status(404).json({ error: "no encontrado" });

    // expiración (48h ya la seteas en el schema)
    if (pay.codeExpiresAt && pay.codeExpiresAt.getTime() < Date.now()) {
      return res.status(410).json({ error: "código expirado" });
    }

    if (pay.status !== "pending") {
      return res.status(400).json({ error: `estado actual: ${pay.status}` });
    }

    // comparar contra el code real en BD (modelo guarda uppercase)
    if (String(code).toUpperCase() !== pay.code) {
      pay.failedAttempts = (pay.failedAttempts ?? 0) + 1; // opcional: registrar intentos
      await pay.save();
      return res.status(401).json({ error: "código inválido" });
    }

    // confirmar
    pay.status = "paid";
    pay.paymentDate = new Date();
    await pay.save();

    return res.json({
      message: "confirmado",
      data: {
        id: String(pay._id),
        total: pay.amount.total,
        status: pay.status,
        paidAt: pay.paymentDate,
      },
    });
  } catch (e: any) {
    return res.status(400).json({ error: e.message || "Error confirmando pago (lab)" });
  }
}
