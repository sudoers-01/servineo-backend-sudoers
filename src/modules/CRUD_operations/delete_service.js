require('dotenv').config();

const dbConnection = require('../../database');

dbConnection();

const Location = require('../../models/Location');

let connected = false;

async function set_db_connection(){
    if(!connected){
        await db_connection();
        connected = true;
    }
}



//Ubicaciones
async function delete_location_by_display_name(name){ 
    await set_db_connection();
    const location = await Location.findOneAndDelete({display_name: name});
    return location;    
}

async function delete_many_locations_by_display_name(names){
    await set_db_connection();
    const locations = await Location.deleteMany({display_name: names});
    return locations;

}

async function delete_location_by_place_id(id){
    await set_db_connection();
    const location = await Location.findOneAndDelete({place_id: id});
    return location;

}

async function delete_many_locations_by_place_id(ids){
    await set_db_connection();
    const locations = await Location.deleteMany({place_id: ids});
    return locations;

}

async function delete_many_locations_by_query(query){
    await set_db_connection();
    const locations = await Location.deleteMany(query);
    return locations;
    
}

module.exports = {
    delete_location_by_display_name,
    delete_many_locations_by_display_name,
    delete_location_by_place_id,
    delete_many_locations_by_place_id,
    delete_many_locations_by_query
}