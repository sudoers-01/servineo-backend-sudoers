import 'express';
import {
    update_appointment_by_id,
    update_fixer_availability,
    fixer_cancell_appointment_by_id
} from '../../services/appointment/update_appointment.service.js';

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

        return res.status(200).json({ message: 'Updated succesfully', modified });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error updating appointment data.', modified: false, error: err.message });
    }
}

export async function updateFixerAvailability(req, res) {
    try {
        const { fixer_id, availability } = req.body;
        if (!fixer_id || !availability) {
            return res.status(400).json({ message: 'Missing parameters: required fixer_id and availability.' });
        }
        await update_fixer_availability(fixer_id, availability);
        return res.status(200).json({ message: 'Fixer availability updated successfully.', updated: true });
    } catch (err) {
        return res.status(500).json({ message: 'Error al actualizar disponibilidad: ' + err.message, updated: false });
    }
}

export async function fixerCancellAppointment(req, res) {
    try {
        const { appointment_id } = req.query;
        if (!appointment_id) {
            return res.status(400).json({
                succedd: false,
                message: "Missing query parameter"
            });
        }
        const modified = await fixer_cancell_appointment_by_id(appointment_id);
        res.status(200).json({
            succeed: true,
            message: `Appointment with id: ${appointment_id} cancelled`,
            modified
        });
    } catch (error) {
        res.status(500).json({
            succeed: false,
            message: "Error cancelling appointment",
            error: error.message
        });
    }
}

export default {
    updateAppointmentById
};