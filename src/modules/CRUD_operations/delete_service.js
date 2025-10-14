import * as dotenv from 'dotenv';

import db_connection from '../../database.js';
import Location from '../../models/Location.js';
import Appointment from '../../models/Appointment.js';

dotenv.config();

let connected = false;

async function set_db_connection() {
  if (!connected) {
    await db_connection();
    connected = true;
  }
}

//Ubicaciones
async function delete_location_by_display_name(name) {
  await set_db_connection();
  return await Location.findOneAndDelete({ display_name: name });
}

async function delete_many_locations_by_display_name(names) {
  await set_db_connection();
  const locations = await Location.find({ display_name: names });
  await Location.deleteMany({ display_name: names });
  return locations;
}

async function delete_location_by_place_id(id) {
  await set_db_connection();
  return await Location.findOneAndDelete({ place_id: id });
}

async function delete_many_locations_by_place_id(ids) {
  await set_db_connection();
  const locations = await Location.find({ place_id: ids });
  await Location.deleteMany({ place_id: ids });
  return locations;
}

async function delete_many_locations_by_query(query) {
  await set_db_connection();
  const locations = await Location.find(query);
  await Location.deleteMany(query);
  return locations;
}

// Funciones faltantes para Appointments
async function delete_appointment_by_id(id) {
  await set_db_connection();
  return await Appointment.findByIdAndDelete(id);
}

async function delete_many_appointments_by_ids(ids) {
  await set_db_connection();
  const appointments = await Appointment.find({ _id: { $in: ids } });
  await Appointment.deleteMany({ _id: { $in: ids } });
  return appointments;
}

async function delete_appointment_by_fixer_id(fixer_id) {
  await set_db_connection();
  return await Appointment.findOneAndDelete({ id_fixer: fixer_id });
}

async function delete_many_appointments_by_fixer_id(fixer_id) {
  await set_db_connection();
  const appointments = await Appointment.find({ id_fixer: fixer_id });
  await Appointment.deleteMany({ id_fixer: fixer_id });
  return appointments;
}

async function delete_appointment_by_requester_id(requester_id) {
  await set_db_connection();
  return await Appointment.findOneAndDelete({ id_requester: requester_id });
}

async function delete_many_appointments_by_requester_id(requester_id) {
  await set_db_connection();
  const appointments = await Appointment.find({ id_requester: requester_id });
  await Appointment.deleteMany({ id_requester: requester_id });
  return appointments;
}

async function delete_appointments_by_query(query) {
  await set_db_connection();
  const appointments = await Appointment.find(query);
  await Appointment.deleteMany(query);
  return appointments;
}

async function delete_all_appointments() {
  await set_db_connection();
  const appointments = await Appointment.find({});
  await Appointment.deleteMany({});
  return appointments;
}

export {
  delete_location_by_display_name,
  delete_many_locations_by_display_name,
  delete_location_by_place_id,
  delete_many_locations_by_place_id,
  delete_many_locations_by_query,
  delete_appointment_by_id,
  delete_many_appointments_by_ids,
  delete_appointment_by_fixer_id,
  delete_many_appointments_by_fixer_id,
  delete_appointment_by_requester_id,
  delete_many_appointments_by_requester_id,
  delete_appointments_by_query,
  delete_all_appointments,
};
