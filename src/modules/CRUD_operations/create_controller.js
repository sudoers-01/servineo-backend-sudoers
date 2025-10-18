import 'express';
import {
  create_appointment
} from './create_service.js';

// TODO: fix, controladores deben devolver siempre status codes, dataExists no debe existir
// ! no esta devolviendo status code con json de respuesta, revisar dataExists
// ? preguntar a vale que necesita de devolucion
// ? boolean si se pudo o no

// TODO: Mantener endpoint Vale (revisar si existen fallas con el nuevo esquema de la db).
export async function createAppointment(req, res) {
  try {
    const appointmentData = req.body;

    if (!appointmentData || Object.keys(appointmentData).length === 0) {
      return res.status(400).json({ success: false, message: 'Missing appointment data in body.' });
    }

    const result = await create_appointment(appointmentData);

    return res.status(200).json({
      success: true,
      message: result.created
        ? 'Appointment created successfully.'
        : 'Schedule added to existing appointment.',
      created: result,
    });

  } catch (err) {
    console.error('Error in controller:', err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error.', error: err.message });
  }
}