import 'express';
import * as ReadAppointmentService from '../../services/appointment/read_appointment.service.js'

// * Fixed Endpoint Arrick: Devolvia mucho 404.
// * Anteriores 2 endpoints unificados: se obtienen todas las citas de un dia 
// ? Inclue a todas las citas de todos los requesters en el dia
export async function getAppointmentsByDate(req, res) {
    try {
        const { id_fixer, selected_date } = req.query;
        if (!id_fixer || !selected_date) {
            return res.status(400).json({
                success: false,
                message: 'Missing parameter: required fixer id or selected date'
            });
        }
        const { appointments } = await ReadAppointmentService.get_appointments_by_fixer_day(id_fixer, selected_date);
        return res.status(200).json({
            success: true,
            message: 'Appointments for the selected date successfully accessed',
            accessed_appointments: appointments
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error accessing appointments for the selected date.',
            error: err.message
        });
    }
}

// * Fixed Endpoint Pichon: -
export async function getModalFormAppointment(req, res) {
    try {
        const { fixer_id, requester_id, appointment_date, start_hour } = req.query;
        console.log(req.query);
        if (!fixer_id || !requester_id || !appointment_date || !start_hour) {
            return res.status(400).json({ message: 'Missing parameter: required fixer_id, requester_id, appointment_date and start_hour' })
        }

        const date = new Date(appointment_date);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: 'Invalid date format for appointment_date.' });
        }

        const hour = parseInt(start_hour);
        if (isNaN(hour) || hour < 0 || hour > 23) {
            return res.status(400).json({ message: 'Invalid start_hour. Must be between 0 and 23.' });
        }

        const data = await ReadAppointmentService.get_modal_form_appointment(fixer_id, requester_id, date, hour);

        if (!data) {
            return res.status(404).json({ message: 'No appointment found for the specified parameters.' });
        }

        return res.status(200).json({
            message: 'Appointment modal data found.',
            data: data
        });

    } catch (error) {
        console.error(error);

        if (error.message === "Appointment does not exist.") {
            return res.status(404).json({ message: error.message });
        }

        res.status(500).json({ message: 'Error fetching modal form appointment data.' });
    }
}

// * Fixed Endpoint Mateo: Reemplazar Body por query y verificar que funcione correctamente.
export async function getMeetingStatus(req, res) {
    try {
        const { id_requester, id_fixer, selected_date, starting_time } = req.query;
        console.log(req.query);
        if (!id_requester || !id_fixer || !selected_date || !starting_time) {
            return res.status(400).json({ message: 'Missing parameters: required requester id, fixer id, date or starting hour' });
        }
        const { name, status } = await ReadAppointmentService.get_meeting_status(id_requester, id_fixer, selected_date, starting_time);
        console.log(name, status);
        return res.status(200).json({ message: 'Meeting status successfully accessed', name, status });
    } catch (err) {
        return res.status(500).json({ message: 'Error updating appointment data', name: "", status: "", error: err.message });
    }
}

export async function getAppointmentByFixerIdHour(req, res) {
    try {
        const { fixer_id, date, hour } = req.query;
        if (!fixer_id || !date || !hour) {
            return res.satus(400).json({
                succeed: false,
                message: "Missing query parameters"
            });
        }
        const data = await ReadAppointmentService.get_appointment_by_fixer_id_hour(fixer_id, date, hour);
        res.status(200).json({
            succeed: true,
            message: data ? "Appointment found" : "Appoitment not found",
            appointment: data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            succeed: false,
            message: "Error fetching appointment"
        });
    }
}

export async function getFixerAvailability(req, res) {
    const { fixer_id } = req.query;
    if (!fixer_id) {
        return res.status(400).json({ message: 'Missing parameter: required fixer_id' });
    }
    try {
        const data = await ReadAppointmentService.get_fixer_availability(fixer_id);
        return res.status(200).json({ message: 'Fixer availability fetched successfully', availability: data });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching fixer availability: ' + err.message });
    }
}

export async function getAppointmentsByFixerIdAndDate(req, res) {
    try {
        const { id_fixer, date } = req.query;
        if (!id_fixer || !date) {
            return res.status(400).json({
                succeed: false,
                message: "Missing query parameters"
            });
        }
        const appointments = await ReadAppointmentService.get_appointments_by_fixer_id_date(id_fixer, date);
        res.status(200).json({
            succeed: true,
            message: "Appointments fetched succesfully",
            appointments
        });
    } catch (error) {
        res.status(500).json({
            succeed: false,
            message: "Error fetching appointments",
            error: error.message
        });
    }
}

export async function getSixMonthsAppointments(req, res) {
    try {
        const { fixer_id, date } = req.query;
        console.log(req.query);
        if (!fixer_id || !date) {
            return res.status(500).json({ message: 'Parameter fixer_id and date are required' });
        }
        const data = await ReadAppointmentService.get_six_months_appointments(fixer_id, date);
        return res.status(200).json({
            message: 'Six months appointments fetched successfully',
            appointments: data
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching data: ' + err.message });
    }
}

export async function getNumberOfAppointments(req, res) {
    try {
        const { fixer_id, month, year } = req.query;
        if (!fixer_id || !month || !year) {
            return res.status(500).json({ message: 'Parameter fixer_id, month and year are required' });
        }
        const data = await ReadAppointmentService.get_number_of_appointments(fixer_id, month, year);
        return res.status(200).json({
            message: 'Number of appointments fetched successfully',
            number_of_appointments: data
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching data: ' + err.message });
    }
}