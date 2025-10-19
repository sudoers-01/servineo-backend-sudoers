import * as dotenv from 'dotenv';
import db_connection from '../../database.js';
import Appointment from '../../models/Appointment.js';

dotenv.config();

let connected = false;

async function set_db_connection() {
  if (!connected) {
    await db_connection();
    connected = true;
  }
}

// TODO: CHAMO LOCURAS (Todos los occupied de un fixer_id, que NO vayan con el requester_id)
async function get_all_requester_schedules_by_fixer_month(fixer_id, requester_id, month) {
  await set_db_connection();
  const required_state = "occupied";
  const current_date = new Date();
  const current_year = current_date.getUTCFullYear();
  const target_month = parseInt(month) - 1; // Mongoose usa 0-indexed months
  const start_date = new Date(Date.UTC(current_year, target_month, 1, 0, 0, 0));
  const finish_date = new Date(Date.UTC(current_year, target_month + 1, 0, 23, 59, 59, 999));
  return Appointment.find(
    {
      id_fixer: fixer_id,
      id_requester: { $ne: requester_id },
      schedule_state: required_state,
      selected_date: {
        $gte: start_date,
        $lte: finish_date
      },
    },
    {
      starting_time: 1,
      finishing_time: 1,
      schedule_state: 1,
      appointment_description: 1,
      display_name_location: 1,
      lat: 1,
      lon: 1,
      _id: 1
    },
  );
}

function change_schedule_state_booked_to_occupied(appointment_schedules) {
  if (!appointment_schedules || !Array.isArray(appointment_schedules)) {
    return appointment_schedules || [];
  }
  for (const appointment of appointment_schedules) {
    if (appointment && appointment.schedules && Array.isArray(appointment.schedules)) {
      for (const schedule of appointment.schedules) {
        if (schedule.schedule_state === 'booked') {
          schedule.schedule_state = 'occupied';
        }
      }
    }
  }
  return appointment_schedules;
}

// *: Fixed endpoint Chamo
async function get_requester_schedules_by_fixer_month(fixer_id, requester_id, month) {
  await set_db_connection();
  const required_state = "booked";
  const current_date = new Date();
  const current_year = current_date.getUTCFullYear();
  const target_month = parseInt(month) - 1; // Mongoose usa 0-indexed months
  const start_date = new Date(Date.UTC(current_year, target_month, 1, 0, 0, 0));
  const finish_date = new Date(Date.UTC(current_year, target_month + 1, 0, 23, 59, 59, 999));
  return Appointment.find(
    {
      id_fixer: fixer_id,
      id_requester: requester_id,
      schedule_state: required_state,
      selected_date: {
        $gte: start_date,
        $lte: finish_date
      },
    },
    {
      starting_time: 1,
      finishing_time: 1,
      schedule_state: 1,
      appointment_description: 1,
      display_name_location: 1,
      lat: 1,
      lon: 1,
      _id: 1
    },
  );
}

// *: Fixed Endpoint Mateo: Reemplazar Body por query y verificar que funcione correctamente.
async function get_meeting_status(requester_id, fixer_id, current_date, start_hour) {
  try {
    await set_db_connection();
    const adjusted_date = new Date(current_date);
    const current_year = adjusted_date.getUTCFullYear();
    const current_month = adjusted_date.getUTCMonth();
    const current_day = adjusted_date.getUTCDate();
    const starting_date = new Date(Date.UTC(current_year, current_month, current_day, start_hour, 0, 0));
    const finish_date = new Date(Date.UTC(current_year, current_month, current_day, (start_hour + 1), 0, 0));
    const appointment = await Appointment.findOne({
      id_requester: requester_id,
      id_fixer: fixer_id,
      starting_time: {
        $gte: starting_date,
        $lt: finish_date
      }
    });
    if (!appointment) {
      return { name: "", status: 'available' };
    } else {
      return { name: appointment.current_requester_name, status: appointment.schedule_state };
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

// * Fixed Endpoint Arrick: Devolvia mucho 404.
// * Anteriores 2 endpoints unificados: se obtienen todas las citas de un dia 
// ? Inclue a todas las citas de todos los requesters en el dia
async function get_appointments_by_fixer_day(fixer_id, requested_date) {
  try {
    await set_db_connection();
    const founded_appointments = await Appointment.find({
      id_fixer: fixer_id,
      selected_date: requested_date
    });
    return { appointments: founded_appointments };
  } catch (err) {
    throw new Error(err.message);
  }
}

// * Fixear Endpoint Pichon: -
async function get_modal_form_appointment(fixer_id, requester_id, appointment_date, start_hour) {
  try {
    await set_db_connection();

    const current_year = appointment_date.getUTCFullYear();
    const current_month = appointment_date.getUTCMonth();
    const current_day = appointment_date.getUTCDate();

    const exact_start_date = new Date(Date.UTC(current_year, current_month, current_day, start_hour, 0, 0));
    const appointment = await Appointment.findOne({
      id_fixer: fixer_id,
      id_requester: requester_id,
      starting_time: exact_start_date
    });

    if (!appointment) {
      throw new Error("Appointment does not exist.");
    };

    return {
      _id: appointment._id,
      id_fixer: appointment.id_fixer,
      current_requester_name: appointment.current_requester_name,
      appointment_type: appointment.appointment_type,
      appointment_description: appointment.appointment_description,
      link_id: appointment.link_id,
      current_requester_phone: appointment.current_requester_phone,
      latitude: appointment.lat,
      longitude: appointment.lon,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

export {
  get_all_requester_schedules_by_fixer_month,
  get_requester_schedules_by_fixer_month,
  get_appointments_by_fixer_day,
  get_modal_form_appointment,
  get_meeting_status
};
