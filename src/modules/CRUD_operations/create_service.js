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
// * Mantener endpoint Vale (revisar si existen fallas con el nuevo esquema de la db).
// * Existian incompatibilidades con el esquema modificado
// ? Asuntos modificados: Ya no se actualizan appointments existentes.
// ? Si ya existe un appointment con el mismo fixer, fecha y hora, se rechaza la creacion.
async function create_appointment(current_appointment) {
  try {
    await set_db_connection();
    const fixer_id = current_appointment.id_fixer;
    const date_selected = current_appointment.selected_date;
    const time_starting = current_appointment.starting_time;

    const exists = await Appointment.findOne({
      id_fixer: fixer_id,
      selected_date: date_selected,
      starting_time: time_starting
    });
    console.log(exists);
    let appointment = null;
    if (!exists) {
      appointment = new Appointment(current_appointment);
      await appointment.save();
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