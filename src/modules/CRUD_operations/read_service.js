import * as dotenv from 'dotenv';
import db_connection from '../../database';
import Location from '../../models/Location';
import Appointment from '../../models/Appointment';

dotenv.config();

let connected = false;

async function set_db_connection() {
    if (!connected) {
        await db_connection();
        connected = true;
    }
}

async function get_all_locations() {
    await set_db_connection();
    return Location.find();
}

async function get_location_by_display_name(name) {
    await set_db_connection();
    return Location.findOne({ display_name: name });
}

async function get_many_locations_by_display_name(name){
    await set_db_connection();
    return Location.find({display_name: name});
}

async function get_location_by_place_id(id) {
    await set_db_connection();
    return Location.findOne({ place_id: id });
}

async function get_many_locations_by_place_id(id){
    await set_db_connection();
    return Location.find({ place_id: id });
}

async function get_locations_by_query_projection(query, projection) {
    await set_db_connection();
    return Location.find(query, projection);
}

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

    let appointment_schedules = await Appointment.find({
        id_fixer: fixer_id,
        id_requester: requester_id,
        selected_date: { $gte: start_date, $lte: finish_date }
    });
    let final_list = change_schedule_state_booked_to_occupied(appointment_schedules);

}

async function change_schedule_state_booked_to_occupied(appointment_schedules){
    await set_db_connection();
    for(const appointment of appointment_schedules){
        for(const schedule of appointment.schedules){
            if(schedule.schedule_state === 'booked'){ 
                schedule.schedule_state = 'occupied';
            }
        }   
    }
    return appointment_schedules;
} 

module.exports = {
    get_all_locations,
    get_location_by_display_name,
    get_many_locations_by_display_name,
    get_location_by_place_id,
    get_many_locations_by_place_id,
    get_locations_by_query_projection,
    get_all_appointments,
    get_appointment_by_query_projection,
    get_all_requester_schedules_by_fixer_month,
    get_requester_schedules_by_fixer_month
};
