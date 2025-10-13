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
async function create_location(current_location){
    
    await set_db_connection();
    const location = new Location(current_location);
    const location_saved = await location.save();
    return location_saved;
    
}
async function insert_one_location(current_location){
    
    await set_db_connection();
    const location_saved = await Location.insertOne(current_location);
    return location_saved;
    
}

async function insert_many_locations(locations){

    await set_db_connection();
    const locations_saved = await Location.insertMany(locations);
    return locations_saved;

}

//Citas
async function create_appointment(current_appointment){
    
    await set_db_connection();
    const appointment = new Appointment(current_appointment);
    const appointment_saved = await appointment.save();
    return appointment_saved;
    
}

async function insert_one_appointment(current_appointment){
    await set_db_connection();
    const appointment_saved = await Appointment.insertOne(current_appointment);
    return appointment_saved;
}

async function insert_many_appointments(appointments){

    await set_db_connection();
    const appontments_saved = await Appointment.insertMany(appointments);
    
    return appontments_saved;

}

module.exports = {
    create_location,
    insert_one_location,
    insert_many_locations,
    create_appointment,
    insert_one_appointment,
    insert_many_appointments
}

//console.log(location);

//create_location()
//    .then(location_saved => console.log(location_saved))
//    .catch(err => console.log(err))