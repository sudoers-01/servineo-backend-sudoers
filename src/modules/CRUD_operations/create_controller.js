import 'express';
import {
  create_appointment
} from './create_service.js';

// * Fixed: fix, controladores deben devolver siempre status codes, dataExists no debe existir
// *Fixed: no esta devolviendo status code con json de respuesta, revisar dataExists
// * preguntar a vale que necesita de devolucion
// * boolean si se pudo o no

// * Mantener endpoint Vale (revisar si existen fallas con el nuevo esquema de la db).
// * Existian incompatibilidades con el esquema modificado
// ? Asuntos modificados: Ya no se actualizan appointments existentes.
// ? Si ya existe un appointment con el mismo fixer, fecha y hora, se rechaza la creacion.
export async function createAppointment(req, res) {
  try {
    const appointmentData = req.body;

    if (!appointmentData || Object.keys(appointmentData).length === 0) {
      return res.status(400).json({ success: false, message: 'Missing appointment data in body.' });
    }

    const result = await create_appointment(appointmentData);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create appointment, current appointment already exists.',
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'Appointment created successfully.',
        created: result,
      });
    }

  } catch (err) {
    console.error('Error in controller:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error.', error: err.message });
  }
}