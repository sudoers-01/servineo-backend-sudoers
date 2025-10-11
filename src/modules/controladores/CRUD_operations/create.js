require('dotenv').config();

const dbConnection = require('../../../database');

dbConnection();

const Location = require('../../../models/Location');

//Ubicaciones
async function create_location(current_location){
    try{
        const location = new Location(current_location);
        const location_saved = await location.save();
        console.log('Ubicacion registrada correctamente.');
        return location_saved;
    }catch(err){
        console.log('Error, la ubicacion no se ha podido registrar: ', err);
        throw err;
    }
}

async function insert_one_location(current_location){
    try{
        const location_saved = await Location.insertOne(current_location);
        console.log('Ubicacion registrada correctamente.');
        return location_saved;
    }catch(err){
        console.log('Error, la ubicacion no se ha podido registrar: ', err);
        throw err;
    }
}

async function insert_many_locations(locations){
    try{
        const locations_saved = await Location.insertMany(locations);
        console.log('Ubicaciones registradas correctamente.');
        return locations_saved;
    }catch(err){
        console.log('Error, las ubicaciones no se han podido registrar: ', err);
        throw err;
    }
}

module.exports = {
    create_location,
    insert_one_location,
    insert_many_locations
}

//console.log(location);

//create_location()
//    .then(location_saved => console.log(location_saved))
//    .catch(err => console.log(err))