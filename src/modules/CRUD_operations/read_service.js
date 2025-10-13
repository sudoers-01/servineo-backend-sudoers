require('dotenv').config();

const db_connection = require('../../database');
const Location = require('../../models/Location');
const Appointment = require('../../models/Appointment');

let connected = false;

async function set_db_connection() {
    if (!connected) {
        await db_connection();
        connected = true;
    }
}

// -------------------- Locations --------------------

async function get_all_locations() {
    await set_db_connection();
    return Location.find();
}

async function get_location_by_display_name(name) {
    await set_db_connection();
    return Location.findOne({ display_name: name });
}

async function get_location_by_place_id(place_id) {
    await set_db_connection();
    return Location.findOne({ place_id });
}

async function get_locations_by_query_projection(query, projection) {
    await set_db_connection();
    return Location.find(query, projection);
}

// -------------------- Appointments --------------------

async function get_all_appointments() {
    await set_db_connection();
    return Appointment.find();
}

async function get_appointment_by_query_projection(query, projection) {
    await set_db_connection();
    return Appointment.find(query, projection);
}

async function get_all_requester_schedules_by_fixer_month(fixer_id, requester_id, month) {
    await set_db_connection();
    const current_date = new Date();
    const current_year = current_date.getFullYear();
    const target_month = month - 1; // Mongoose usa 0-indexed months
    const start_date = new Date(current_year, target_month, 1);
    const finish_date = new Date(current_year, month, 0, 23, 59, 59);

    return Appointment.find({
        id_fixer: fixer_id,
        id_requester: { $ne: requester_id },
        selected_date: { $gte: start_date, $lte: finish_date }
    }, {
        id_fixer: false,
        id_requester: false,
        selected_date: false,
        selected_date_state: false,
        current_requester_name: false,
        appointment_type: false,
        appointment_description: false,
        place_id: false,
        link_id: false,
        current_requester_phone: false
    });
}

async function get_requester_schedules_by_fixer_month(fixer_id, requester_id, month) {
    await set_db_connection();
    const current_date = new Date();
    const current_year = current_date.getFullYear();
    const target_month = month - 1;
    const start_date = new Date(current_year, target_month, 1);
    const finish_date = new Date(current_year, month, 0, 23, 59, 59);

    return Appointment.find({
        id_fixer: fixer_id,
        id_requester: requester_id,
        selected_date: { $gte: start_date, $lte: finish_date }
    }, {
        id_fixer: false,
        id_requester: false,
        selected_date: false,
        selected_date_state: false,
        current_requester_name: false,
        appointment_type: false,
        appointment_description: false,
        place_id: false,
        link_id: false,
        current_requester_phone: false
    });
}

module.exports = {
    get_all_locations,
    get_location_by_display_name,
    get_location_by_place_id,
    get_locations_by_query_projection,
    get_all_appointments,
    get_appointment_by_query_projection,
    get_all_requester_schedules_by_fixer_month,
    get_requester_schedules_by_fixer_month
};
