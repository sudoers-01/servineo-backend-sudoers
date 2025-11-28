// src/Innosys/controllers/invoice.controller.ts
// src/Innosys/controllers/invoice.controller.ts
import { Request, Response, NextFunction } from 'express';
import mongoose, { Document, Types } from 'mongoose';
import InvoiceModel from '../models/Invoice'; // Asegúrate de que esta ruta de importación sea correcta

// =================================================================
// INTERFAZ DEL DOCUMENTO DE FACTURA
// =================================================================
interface IDetailItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface InvoiceDocument extends Document {
  _id: Types.ObjectId;
  transactionId: string;
  requesterId: string;
  requesterName: string;
  date: Date;
  total: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'MXN';
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  items: IDetailItem[];
  notes: string;
  // Campos para compatibilidad con el frontend si fuera necesario (simulando impuestos/subtotales)
  taxRate?: number;
  taxAmount?: number;
}

// =================================================================
// OBTENER FACTURAS FILTRADAS POR requesterId Y STATUS = 'PAID'
// (Usado por InvoiceList.tsx)
// =================================================================
export const getInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. OBTENER el requesterId del query parameter enviado por el frontend
    const authenticatedRequesterId = req.query.requesterId as string | undefined;

    // 2. VALIDACIÓN DE SEGURIDAD: Asegurarse de que el ID está presente
    if (!authenticatedRequesterId) {
      // Rechazar si no se proporciona el ID de usuario
      return res.status(401).json({ success: false, message: 'Requester ID es obligatorio para cargar facturas.' });
    }

    // 3. CONSTRUCCIÓN DEL FILTRO usando el ID proporcionado
    const filter = {
      requesterId: authenticatedRequesterId, // <-- FILTRO DINÁMICO: USA EL ID DEL FRONTEND
      status: 'PAID', // <-- Solo facturas pagadas (como se usa en el frontend)
    };

    const invoices = (await InvoiceModel.find(filter)
      .select('transactionId requesterName date total currency status requesterId')
      .sort({ date: -1 })) as InvoiceDocument[];

    const formattedInvoices = invoices.map(invoice => ({
      id: invoice._id.toString(),
      transactionId: invoice.transactionId,
      requesterName: invoice.requesterName,
      date: invoice.date.toISOString().split('T')[0],
      total: invoice.total,
      currency: invoice.currency,
      status: invoice.status,
      requesterId: invoice.requesterId,
    }));

    return res.status(200).json({ success: true, data: formattedInvoices });
  } catch (error) {
    next(error);
  }
};

// =================================================================
// OBTENER DETALLE COMPLETO DE UNA FACTURA POR ID
// (Usado por InvoiceDetailPage.tsx)
// =================================================================
export const getInvoiceDetail = async (req: Request, res: Response, next: NextFunction) => {
  const { invoiceId } = req.params;
  // ** CAMBIO CLAVE: Obtener el requesterId del query string enviado por el frontend **
  const authenticatedRequesterId = req.query.requesterId as string | undefined;

  if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
    return res.status(400).json({ success: false, message: 'ID de factura inválido.' });
  }
  
  // 1. Verificar la presencia del ID de seguridad
  if (!authenticatedRequesterId) {
      // 401 Unauthorized si falta el token de propiedad
      return res.status(401).json({ success: false, message: 'Requester ID es obligatorio para acceder al detalle.' });
  }

  try {
    // 2. Aplicar el filtro de seguridad: La factura debe coincidir con el ID y pertenecer al requesterId
    const invoice = (await InvoiceModel.findOne({
        _id: invoiceId,
        requesterId: authenticatedRequesterId // <-- FILTRO DE SEGURIDAD CRÍTICO
    })) as InvoiceDocument | null;

    if (!invoice) {
      // 404 Not Found si la factura no existe O la factura existe pero no pertenece al usuario.
      return res.status(404).json({ success: false, message: 'Factura no encontrada o acceso denegado.' });
    }
    
    // Simulación de cálculos de impuestos si no vienen del modelo original
    const calculatedSubtotal = invoice.items.reduce((sum, item) => sum + (item.subtotal ?? 0), 0);
    const taxRate = 0.16; // 16% de IVA simulado
    const taxAmount = (invoice.total - calculatedSubtotal) > 0 ? (invoice.total - calculatedSubtotal) : 0; // Usar la diferencia si existe

    const formattedInvoice = {
      id: invoice._id.toString(),
      transactionId: invoice.transactionId,
      requesterId: invoice.requesterId,
      requesterName: invoice.requesterName,
      date: invoice.date.toISOString().split('T')[0],
      totalAmount: invoice.total, // Renombrado para coincidir con el frontend
      taxRate: taxRate, 
      taxAmount: taxAmount,
      service: "Servicio General Contratado", // Campo simulado para el frontend
      items: invoice.items,
      notes: invoice.notes,
    };

    return res.status(200).json({ success: true, data: formattedInvoice });
  } catch (error) {
    next(error);
  }
};