require('dotenv').config();

const db_connection = require('../../database');
const Location = require('../../models/Location');
const Appointment = require('../../models/Appointment');

let connected = false;

async function set_db_connection(){
    if(!connected){
        await db_connection();
        connected = true; 
    }
}

//Ubicaciones
async function get_all_locations(){
    try{
        await set_db_connection();
        const locations = await Location.find();
        console.log('Acceso correcto a todas las ubicaciones.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo acceder a todas las ubicaciones: ', err);
        throw err;
    }
}

async function get_location_by_display_name(name){
    try{
        await set_db_connection();
        const locations = await Location.findOne({display_name: name});
        console.log('Acceso correcto a la ubicacion.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo acceder a la ubicacion: ', err);
        throw err;
    }
}

async function get_location_by_place_id(id){
    try{
        await set_db_connection();
        const locations = await Location.findOne({place_id: id});
        console.log('Acceso correcto a la ubicacion.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo acceder a la ubicacion: ', err);
        throw err;
    }
}

async function get_locations_by_query_projection(query, projection){
    try{
        await set_db_connection();
        const locations = await Location.find(query, projection);
        console.log('Acceso correcto a las ubicaciones.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo acceder a las ubicaciones: ', err);
        throw err;
    }
}

//Citas
async function get_all_appointments(){
    try{
        await set_db_connection();
        const appointments = await Appointment.find();
        console.log('Acceso correcto a todas las citas.');
        return appointments;
    }catch(err){
        console.log('Error, no se pudo acceder a todas las citas.');
        throw err;
    }
}

async function get_all_requester_schedules_by_fixer_month(fixer_id, requester_id, month){
    try{
        await set_db_connection();
        const current_date = new Date(Date.now());
        const current_year = current_date.getFullYear();
        const target_month = month - 1;
        const start_date = new Date(current_year, target_month, 1);
        const finish_date = new Date(current_year, month, 0, 23, 59, 59);
        const appointment = await Appointment.find({
            id_fixer: fixer_id, 
            id_requester: {$ne: requester_id},
            selected_date: {
                $gte: start_date, 
                $lte: finish_date
            }
        }, 
        {
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
        console.log('Acceso correcto a los horarios.');
        return appointment
    }catch(err){
        console.log('Error, no se pudo acceder a los horarios.');
    }
}

async function get_appointment_by_query_projection(query, projection){
    try{
        await set_db_connection();
        const appointments = await Appointment.find(query, projection);
        console.log('Acceso correcto a las citas.');
        return appointments;
    }catch(err){
        console.log('Error, no se pudo acceder a las citas.');
    }
}

async function get_requester_schedules_by_fixer_month(fixer_id, requester_id, month){
    try{
        await set_db_connection();
        const current_date = new Date(Date.now());
        const current_year = current_date.getFullYear();
        const target_month = month - 1;
        const start_date = new Date(current_year, target_month, 1);
        const finish_date = new Date(current_year, month, 0, 23, 59, 59);
        const schedules = await Appointment.find({
            id_fixer: fixer_id,
            id_requester: requester_id,
            selected_date: {
                $gte: start_date,
                $lte: finish_date
            }
        },
        {
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
        console.log('Acceso correcto a los horarios.');
        return schedules;
    }catch(err){
        console.log('Error, no se pudo acceder a los horarios');
    }
}

module.exports = {
    get_all_locations,
    get_location_by_display_name,
    get_location_by_place_id,
    get_locations_by_query_projection,
    get_all_appointments,
    get_all_requester_schedules_by_fixer_month,
    get_appointment_by_query_projection,
    get_requester_schedules_by_fixer_month
}