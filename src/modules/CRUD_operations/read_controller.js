// read_controller.js
import { Request, Response } from 'express';
import {
  getAllAppointments,
  getAppointmentByQueryProjection,
  getRequesterSchedulesByFixerMonth,
  getAllRequesterSchedulesByFixerMonth
} from './read_service'; // llamamos al service

// Obtener todas las citas
export async function getAllAppointmentsController(req: Request, res: Response) {
  try {
    const appointments = await getAllAppointments();
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
}

// Obtener citas por query específica
export async function getAppointmentByQueryController(req: Request, res: Response) {
  try {
    const { query } = req.body; // query vendría en el body
    const { projection } = req.body; // opcional
    if (!query) {
      return res.status(400).json({ message: 'Missing query in request body' });
    }

    const appointments = await getAppointmentByQueryProjection(query, projection);
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for the given query' });
    }

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointments by query' });
  }
}

// Obtener horarios de un requester en un mes específico
export async function getRequesterSchedulesByFixerMonthController(req: Request, res: Response) {
  try {
    const { fixer_id, requester_id, month } = req.query;
    if (!fixer_id || !requester_id || !month) {
      return res.status(400).json({ message: 'Missing required query parameters: fixer_id, requester_id, month' });
    }

    const schedules = await getRequesterSchedulesByFixerMonth(fixer_id as string, requester_id as string, Number(month));
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this requester in the specified month' });
    }

    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching requester schedules by fixer and month' });
  }
}

// Obtener todos los horarios de otros requesters de un fixer en un mes específico
export async function getAllRequesterSchedulesByFixerMonthController(req: Request, res: Response) {
  try {
    const { fixer_id, requester_id, month } = req.query;
    if (!fixer_id || !requester_id || !month) {
      return res.status(400).json({ message: 'Missing required query parameters: fixer_id, requester_id, month' });
    }

    const schedules = await getAllRequesterSchedulesByFixerMonth(fixer_id as string, requester_id as string, Number(month));
    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for other requesters in this month' });
    }

    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching all requester schedules by fixer and month' });
  }
}
