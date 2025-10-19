// read_controller.js
import 'express';
import {
  get_all_requester_schedules_by_fixer_month,
  get_requester_schedules_by_fixer_month,
  get_meeting_status,
} from './read_service.js'; // llamamos al service

// Obtener horarios de un requester en un mes específico
// TODO: fix, controladores deben devolver siempre status codes, dataExists no debe existir
// * FIXED Endpoint Chamo: -
export async function getRequesterSchedulesByFixerMonth(req, res) {
  try {
    const { fixer_id, requester_id, month } = req.query;
    if (!fixer_id) {
      res.status(400).json({ message: 'Missing required query parameters: fixer_id.' });
      return;
    }
    if (!requester_id) {
      res.status(400).json({ message: 'Missing required query parameters: requester_id.' });
      return;
    }
    if (!month) {
      res.status(400).json({ message: 'Missing required query parameters: month.' });
      return;
    }
    const data = await get_requester_schedules_by_fixer_month(fixer_id, requester_id, month);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching requester schedules by fixer and month.' });
  }
}

// TODO: fix, controladores deben devolver siempre status codes, dataExists no debe existir
export async function getAllRequesterSchedulesByFixerMonth(req, res) {
  try {
    const { fixer_id, requester_id, month } = req.query;
    if (!fixer_id) {
      res.status(400).json({ message: 'Missing required query parameters: fixer_id.' });
      return;
    }
    if (!requester_id) {
      res.status(400).json({ message: 'Missing required query parameters: requester_id.' });
      return;
    }
    if (!month) {
      res.status(400).json({ message: 'Missing required query parameters: month.' });
      return;
    }
    const data = await get_all_requester_schedules_by_fixer_month(fixer_id, requester_id, month);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all requester schedules by fixer and month.' });
  }
}

// TODO: Fixear Endpoint Arrick: Devuelve mucho 404.
export async function getRequesterSchedulesByFixerDay(req, res) {
  try {
    const { fixer_id, requester_id, searched_date } = req.query;

    if (!fixer_id) {
      return res.status(400).json({ message: 'Missing required query parameters: fixer_id.' });
    }
    if (!requester_id) {
      return res.status(400).json({ message: 'Missing required query parameters: requester_id.' });
    }
    if (!searched_date) {
      return res.status(400).json({ message: 'Missing required query parameters: searched_date.' });
    }

    // Convertir searched_date a objeto Date
    const date = new Date(searched_date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format for searched_date.' });
    }

    //const data = await get_requester_schedules_by_fixer_day(fixer_id, requester_id, date);
    //const output_fail = 'No schedules found for this requester on the specified date.';
    //const output_success = 'Schedules found for this requester. ';
    //await dataExist(data, output_fail, output_success, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching requester schedules by fixer and day.' });
  }
}

//TODO: Fixear Endpoint Arrick: Unificar con el endpoint de arriba.
export async function getAllRequesterSchedulesByFixerDay(req, res) {
  try {
    const { fixer_id, requester_id, searched_date } = req.query;

    if (!fixer_id) {
      return res.status(400).json({ message: 'Missing required query parameters: fixer_id.' });
    }
    if (!requester_id) {
      return res.status(400).json({ message: 'Missing required query parameters: requester_id.' });
    }
    if (!searched_date) {
      return res.status(400).json({ message: 'Missing required query parameters: searched_date.' });
    }

    // Convertir searched_date a objeto Date
    const date = new Date(searched_date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format for searched_date.' });
    }

    //const data = await get_all_requester_schedules_by_fixer_day(fixer_id, requester_id, date);
    //const output_fail = 'No schedules found for other requesters on this date.';
    //const output_success = 'Schedules found for all requesters except this. ';
    //await dataExist(data, output_fail, output_success, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all requester schedules by fixer and day.' });
  }
}

// TODO: Fixear Endpoint Pichon: -
export async function getModalFormAppointment(req, res) {
  try {
    const { fixer_id, requester_id, appointment_date, start_hour } = req.query;

    if (!fixer_id) {
      return res.status(400).json({ message: 'Missing required query parameters: fixer_id.' });
    }
    if (!requester_id) {
      return res.status(400).json({ message: 'Missing required query parameters: requester_id.' });
    }
    if (!appointment_date) {
      return res
        .status(400)
        .json({ message: 'Missing required query parameters: appointment_date.' });
    }
    if (!start_hour && start_hour !== 0) {
      return res.status(400).json({ message: 'Missing required query parameters: start_hour.' });
    }

    // Convertir appointment_date a objeto Date
    const date = new Date(appointment_date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format for appointment_date.' });
    }

    // Validar que start_hour sea un número
    const hour = parseInt(start_hour);
    if (isNaN(hour) || hour < 0 || hour > 23) {
      return res.status(400).json({ message: 'Invalid start_hour. Must be between 0 and 23.' });
    }

    //const data = await get_modal_form_appointment(fixer_id, requester_id, date, hour);
    //const output_fail = 'No appointment found for the specified parameters.';
    //const output_success = 'Appointment modal data found. ';
    //await dataExist(data, output_fail, output_success, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching modal form appointment data.' });
  }
}

// * Fixed Endpoint Mateo: Reemplazar Body por query y verificar que funcione correctamente.
export async function getMeetingStatus(req, res) {
  try {
    const { id_requester, id_fixer, selected_date, starting_time } = req.query;
    console.log(req.query);
    if (!id_requester || !id_fixer || !selected_date || !starting_time) {
      return res.status(400).json({ message: 'Missing parameter function' });
    }
    const { name, status } = await get_meeting_status(id_requester, id_fixer, selected_date, starting_time);
    console.log(name, status);
    return res.status(200).json({ message: 'Meeting status successfully accessed', name, status });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating appointment data', name: "", status: "", error: err.message });
  }
}
