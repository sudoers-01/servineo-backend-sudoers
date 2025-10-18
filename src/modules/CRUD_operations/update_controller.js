import 'express';
import {
  update_appointment_by_id,
} from './update_service.js';

// Appointments - Controladores faltantes

// TODO: Fixear Endpoint Pichon: Refactorizar y probar en Postman.
//? El endpoint esta actualizando mas slots de los que deberia.
export async function updateAppointmentById(req, res) {
  try {
    const id = req.query.id;
    const attributes = req.body;

    if (!id || !attributes) {
      return res.status(400).json({ message: 'Missing parameters: required id and attributes.' });
    }

    const updateData = Object.fromEntries(
      Object.entries(attributes).filter((v) => v !== undefined && v !== null),
    );

    const modified = await update_appointment_by_id(id, updateData);

    res.status(200).json({ message: 'Updated succesfully', modified });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Error updating appointment data.', modified: false, error: err.message });
  }
}