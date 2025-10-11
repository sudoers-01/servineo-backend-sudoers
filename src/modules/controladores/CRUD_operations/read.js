require('dotenv').config();

const dbConnection = require('../../../database');

dbConnection();

const Location = require('../../../models/Location');

//Ubicaciones
async function get_all_locations(){
    try{
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
        const locations = await Location.find(query, projection);
        console.log('Acceso correcto a las ubicaciones.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo acceder a las ubicaciones: ', err);
        throw err;
    }
}

module.exports = {
    get_all_locations,
    get_location_by_display_name,
    get_location_by_place_id,
    get_locations_by_query_projection
}