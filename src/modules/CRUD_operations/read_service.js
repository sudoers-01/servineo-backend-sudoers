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

//--------------------------------------------------------------------------------------------------

//TODO: Fixear Endpoint Arrick: Unificar con el endpoint de arriba.
async function get_all_requester_schedules_by_fixer_day(fixer_id, requester_id, searched_date) {
  await set_db_connection();
  const start_date = new Date(Date.UTC(
    searched_date.getUTCFullYear(),
    searched_date.getUTCMonth(),
    searched_date.getUTCDate(),
    0, 0, 0
  ));
  const finish_date = new Date(Date.UTC(
    searched_date.getUTCFullYear(),
    searched_date.getUTCMonth(),
    searched_date.getUTCDate(),
    23, 59, 59
  ));

  let appointment_schedules = await Appointment.find({
    id_fixer: fixer_id,
    id_requester: { $ne: requester_id },
    selected_date: { $gte: start_date, $lte: finish_date },
  });
  let final_list = change_schedule_state_booked_to_occupied(appointment_schedules);
  const projected_list = final_list.map((appointment) => ({
    schedules: appointment.schedules,
  }));
  return projected_list;
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

//-------------------------------------------------------------------------------------------------------------

// TODO: Fixear Endpoint Chamo: -
async function get_requester_schedules_by_fixer_month(fixer_id, requester_id, month) {
  await set_db_connection();
  const current_date = new Date();
  const current_year = current_date.getUTCFullYear();
  const target_month = month - 1; // Mongoose usa 0-indexed months
  const start_date = new Date(current_year, target_month, 1);
  const finish_date = new Date(current_year, month, 0, 23, 59, 59);
  return Appointment.find(
    {
      id_fixer: fixer_id,
      id_requester: requester_id,
      selected_date: { $gte: start_date, $lte: finish_date },
    },
    {
      schedules: 1,
      _id: 0,
    },
  );
}

// TODO:endpoint mateo
/*
  Este endpoint recibe un id requester, id fixer, una fecha y un horario
{
  success: true ? false,
  message: "asdfasdf",
  status: "occuped" || "available" || "partial"
  name: "nombre del fixer",
}
*/

// TODO: Fixear Endpoint Mateo: Reemplazar Body por query y verificar que funcione correctamente.
async function get_meeting_status(requester_id, fixer_id, current_date, start_hour) {
  try {
    await set_db_connection();
    const adjusted_date = new Date(current_date);
    const current_year = adjusted_date.getUTCFullYear();
    const current_month = adjusted_date.getUTCMonth();
    const current_day = adjusted_date.getUTCDate();
    const starting_date = new Date(Date.UTC(current_year, current_month, current_day, 0, 0, 0));
    const finish_date = new Date(Date.UTC(current_year, current_month, current_day, 23, 59, 59));
    const appointment = await Appointment.findOne({
      id_requester: requester_id,
      id_fixer: fixer_id,
      selected_date: {
        $gte: starting_date,
        $lte: finish_date
      }
    });
    if (!appointment) throw new Error("Could not find a schedule.");
    const founded_schedule = appointment.schedules.find(sched => {
      if (!sched.starting_time) {
        throw new Error("Could not find a schedule.");
      }
      const hour = new Date(sched.starting_time).getUTCHours();
      return (hour === start_hour);
    });
    if (founded_schedule) {
      return {
        name: appointment.current_requester_name,
        status: appointment.selected_date_state
      }
    } else {
      throw new Error("Could not find a schedule.");
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

//-------------------------------------------------------------------------------------------------------

// TODO: Fixear Endpoint Arrick: Devuelve mucho 404.
async function get_requester_schedules_by_fixer_day(fixer_id, requester_id, searched_date) {
  await set_db_connection();
  const current_year = searched_date.getUTCFullYear();
  const current_month = searched_date.getUTCMonth();
  const current_day = searched_date.getUTCDate();
  const start_date = new Date(current_year, current_month, current_day, 0, 0, 0);
  const finish_date = new Date(current_year, current_month, current_day, 23, 59, 59);
  return Appointment.find(
    {
      id_fixer: fixer_id,
      id_requester: requester_id,
      selected_date: { $gte: start_date, $lte: finish_date },
    },
    {
      schedules: 1,
      _id: 0,
    },
  );
}

// TODO: Fixear Endpoint Pichon: -
async function get_modal_form_appointment(fixer_id, requester_id, appointment_date, start_hour) {
  await set_db_connection();
  const current_year = appointment_date.getUTCFullYear();
  const current_month = appointment_date.getUTCMonth();
  const current_day = appointment_date.getUTCDate();
  const start_date = new Date(current_year, current_month, current_day, 0, 0, 0);
  const finish_date = new Date(current_year, current_month, current_day, 23, 59, 59);
  const appointment = await Appointment.findOne({
    id_fixer: fixer_id,
    id_requester: requester_id,
    selected_date: {
      $gte: start_date,
      $lte: finish_date
    },
  });
  if (!appointment) return null;
  const founded_schedule = appointment.schedules.find(sched => {
    if (!sched.starting_time) {
      return false;
    }
    const hour = new Date(sched.starting_time).getUTCHours();
    return (hour === start_hour);
  });
  if (founded_schedule) {
    return {
      _id: appointment._id,
      id_fixer: appointment.id_fixer,
      current_requester_name: appointment.current_requester_name,
      appointment_type: appointment.appointment_type,
      appointment_description: appointment.appointment_description,
      schedules: [founded_schedule]
    };
  } else {
    return null;
  }
}

export {
  get_requester_schedules_by_fixer_month,
  get_requester_schedules_by_fixer_day,
  get_all_requester_schedules_by_fixer_day,
  get_modal_form_appointment,
  get_meeting_status
};
