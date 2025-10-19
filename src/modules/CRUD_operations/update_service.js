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

// TODO: Fixear Endpoint Pichon: Refactorizar y probar en Postman.
//? El endpoint esta actualizando mas slots de los que deberia.
async function update_appointment_by_id(id, attributes) {
  try {
    await set_db_connection();

    // !atributos hay que tener cuidado con schedule
    // TODO: desestructurar schedule

    const docUpdate = await Appointment.findByIdAndUpdate(
      id,
      { $set: attributes },
      { new: true, runValidators: true },
    );

    if (docUpdate) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

export {
  update_appointment_by_id,
};
