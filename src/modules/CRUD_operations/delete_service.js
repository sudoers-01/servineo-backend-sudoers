require('dotenv').config();

const dbConnection = require('../../database');

dbConnection();

const Location = require('../../models/Location');

//Ubicaciones
async function delete_location_by_display_name(name){
    try{
        const location = await Location.findOneAndDelete({display_name: name});
        console.log('Ubicacion eliminada.');
        return location;
    }catch(err){
        console.log('Error, no se pudo eliminar la ubicacion: ', err);
        throw err;
    }
}

async function delete_many_locations_by_display_name(names){
    try{
        const locations = await Location.deleteMany({display_name: names});
        console.log('Ubicaciones eliminadas');
        return locations;
    }catch(err){
        console.log('Error, no se pudieron eliminar las ubicaciones: ', err);
        throw err;
    }
}

async function delete_location_by_place_id(id){
    try{
        const location = await Location.findOneAndDelete({place_id: id});
        console.log('Ubicacion eliminada.');
        return location;
    }catch(err){
        console.log('Error, no se pudo eliminar la ubicacion: ', err);
        throw err;
    }
}

async function delete_many_locations_by_place_id(ids){
    try{
        const locations = await Location.deleteMany({place_id: ids});
        console.log('Ubicaciones eliminadas');
        return locations;
    }catch(err){
        console.log('Error, no se pudieron eliminar las ubicaciones: ', err);
        throw err;
    }
}

async function delete_many_locations_by_query(query){
    try{
        const locations = await Location.deleteMany(query);
        console.log('Ubicaciones eliminadas');
        return locations;
    }catch(err){
        console.log('Error, no se pudieron eliminar las ubicaciones: ', err);
        throw err;
    }
}

module.exports = {
    delete_location_by_display_name,
    delete_many_locations_by_display_name,
    delete_location_by_place_id,
    delete_many_locations_by_place_id,
    delete_many_locations_by_query
}