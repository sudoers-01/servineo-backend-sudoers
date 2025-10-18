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

//Citas
// TODO: revisar que devuelve este metodo
// TODO: Mantener endpoint Vale (revisar si existen fallas con el nuevo esquema de la db).
async function create_appointment(current_appointment) {
  try {
    await set_db_connection();
    const fixer_id = current_appointment.id_fixer;
    const requester_id = current_appointment.id_requester;
    const date_selected = current_appointment.selected_date;
    const time_starting = new Date(current_appointment.starting_time);
    const time_finishing = new Date(time_starting.getTime() + 60 * 60 * 1000);
    const current_diplay_name = current_appointment.display_name;
    const current_lat = current_appointment.lat;
    const current_lon = current_appointment.lon;
    const new_schedule = {
      starting_time: time_starting,
      finishing_time: time_finishing,
      schedule_state: 'booked',
      display_name: current_diplay_name,
      lat: current_lat,
      lon: current_lon,
    };

    const exists = await Appointment.findOne({
      id_fixer: fixer_id,
      id_requester: requester_id,
      selected_date: date_selected,
    });
    let apointment_updated;
    if (!exists) {
      current_appointment.schedules = [new_schedule];
      const appointment = new Appointment(current_appointment);
      // ? revisar que devuelve
      apointment_updated = await appointment.save();
    } else {
      await Appointment.updateOne(
        {
          id_fixer: fixer_id,
          id_requester: requester_id,
          selected_date: date_selected,
        },
        {
          $push: { schedules: new_schedule },
        },
      );
      apointment_updated = await Appointment.findOne({
        id_fixer: fixer_id,
        id_requester: requester_id,
        selected_date: date_selected,
      });
    }
    if (apointment_updated) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error('Error creating appointment: ' + err.message);
  }
}

export {
  create_appointment,
};