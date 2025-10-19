import 'express';
import {
  update_appointment_by_id,
} from './update_service.js';

// * Fixed Endpoint Pichon: Refactorizar y probar en Postman.
// * El endpoint estaba actualizando mas slots de los que deberia, ahora con el nuevo esquema actualiza lo solicitado.
export async function updateAppointmentById(req, res) {
  try {
    const id = req.query.id;
    const attributes = req.body;

    if (!id || !attributes) {
      return res.status(400).json({ message: 'Missing parameters: required id and attributes.' });
    }

    const updateAttributes = Object.fromEntries(
      Object.entries(attributes).filter((v) => v !== undefined && v !== null)
    );

    const modified = await update_appointment_by_id(id, updateAttributes);

    res.status(200).json({ message: 'Updated succesfully', modified });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Error updating appointment data.', modified: false, error: err.message });
  }
}

export default {
  updateAppointmentById,
};