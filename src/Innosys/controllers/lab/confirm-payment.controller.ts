import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Payment } from "../../models/payment.model";

const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 10;

export async function confirmPaymentLab(req: Request, res: Response) {
  const session = await mongoose.startSession();
  
  try {
    const { id } = req.params as { id: string };
    const { code } = (req.body || {}) as { code?: string };

    // Validaciones básicas
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "id inválido" });
    }

    if (!code) {
      return res.status(400).json({ error: "code requerido" });
    }

    // Validar formato del código (ajusta según tu formato real)
    const provided = String(code).toUpperCase().trim();
    if (!/^[A-Z0-9]{4,10}$/.test(provided)) {
      return res.status(400).json({ 
        error: "formato de código inválido" 
      });
    }

    session.startTransaction();

    // Obtener el pago con lock pesimista
    const pay = await Payment.findById(id).session(session);
    
    if (!pay) {
      await session.abortTransaction();
      return res.status(404).json({ error: "pago no encontrado" });
    }

    // Verificar que el pago esté pendiente
    if (String(pay.status).toLowerCase() !== "pending") {
      await session.abortTransaction();
      return res.status(400).json({ 
        error: `el pago ya fue procesado`,
        status: pay.status 
      });
    }

    // Verificar expiración del código
    if (pay.codeExpiresAt && pay.codeExpiresAt.getTime() < Date.now()) {
      await session.abortTransaction();
      return res.status(410).json({ 
        error: "código expirado",
        expiredAt: pay.codeExpiresAt 
      });
    }

    const now = new Date();

    // Verificar si hay un bloqueo activo
    if (pay.lockUntil && pay.lockUntil.getTime() > now.getTime()) {
      await session.abortTransaction();
      const msLeft = pay.lockUntil.getTime() - now.getTime();
      const waitMinutes = Math.ceil(msLeft / 60000);
      
      console.warn(`Payment ${id}: intento rechazado por bloqueo activo`);
      
      return res.status(429).json({
        error: "demasiados intentos fallidos",
        message: `intenta nuevamente en ${waitMinutes} minuto(s)`,
        waitMinutes,
        unlocksAt: pay.lockUntil
      });
    }

    // Limpiar bloqueo si ya expiró
    if (pay.lockUntil && pay.lockUntil.getTime() <= now.getTime()) {
      pay.lockUntil = null;
      pay.failedAttempts = 0;
    }

    const real = String(pay.code);

    // Verificar código
    if (provided !== real) {
      // Incrementar intentos fallidos
      const newAttempts = (pay.failedAttempts ?? 0) + 1;
      pay.failedAttempts = newAttempts;

      console.warn(`Payment ${id}: intento fallido ${newAttempts}/${MAX_ATTEMPTS}`);

      // Bloquear si se alcanzó el límite
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = new Date(now.getTime() + LOCK_MINUTES * 60 * 1000);
        pay.lockUntil = lockUntil;
        await pay.save({ session });
        await session.commitTransaction();

        console.warn(`Payment ${id}: BLOQUEADO por ${LOCK_MINUTES} minutos`);

        return res.status(429).json({
          error: "cuenta bloqueada",
          message: `has superado los ${MAX_ATTEMPTS} intentos; intenta nuevamente en ${LOCK_MINUTES} minuto(s)`,
          waitMinutes: LOCK_MINUTES,
          unlocksAt: lockUntil
        });
      }

      // Guardar intento fallido
      await pay.save({ session });
      await session.commitTransaction();

      const remaining = MAX_ATTEMPTS - newAttempts;
      return res.status(401).json({
        error: "código inválido",
        remainingAttempts: remaining,
        message: `código inválido, te quedan ${remaining} intento(s)`
      });
    }

    // ✅ Código correcto - Confirmar pago usando operación atómica
    const confirmed = await Payment.findOneAndUpdate(
      { 
        _id: id,
        status: "pending", // doble verificación
        code: provided
      },
      {
        $set: {
          status: "paid",
          paymentDate: now,
          failedAttempts: 0,
          lockUntil: null
        }
      },
      { 
        new: true,
        session 
      }
    );

    if (!confirmed) {
      await session.abortTransaction();
      return res.status(409).json({ 
        error: "conflicto: el pago ya fue procesado por otra solicitud" 
      });
    }

    await session.commitTransaction();

    console.info(`Payment ${id}: confirmado exitosamente`);

    return res.json({
      message: "pago confirmado exitosamente",
      data: {
        id: String(confirmed._id),
        total: confirmed.amount.total,
        status: confirmed.status,
        paidAt: confirmed.paymentDate
      }
    });

  } catch (e: any) {
    await session.abortTransaction();
    
    console.error("Error confirmando pago:", {
      error: e.message,
      stack: e.stack,
      paymentId: req.params.id
    });

    // Diferenciar tipos de error
    if (e.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "datos de validación inválidos",
        details: process.env.NODE_ENV === 'development' ? e.message : undefined
      });
    }

    if (e.name === 'CastError') {
      return res.status(400).json({ error: "formato de id inválido" });
    }

    return res.status(500).json({ 
      error: "error del servidor al procesar el pago",
      ...(process.env.NODE_ENV === 'development' && { details: e.message })
    });
    
  } finally {
    session.endSession();
  }
}