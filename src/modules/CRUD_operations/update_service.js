require('dotenv').config();

const dbConnection = require('../../database');
const Location = require('../../models/Location');

let connected = false;

async function set_db_connection() {
    if (!connected) {
        await db_connection();
        connected = true;
    }
}

//Ubicaciones
async function update_location_fields_by_display_name(name, attributes){
    try{
        await set_db_connection();
        const location = await Location.findOneAndUpdate({display_name: name}, {$set: attributes}, {new: true});
        console.log('');
        return location;
    }catch(err){
        console.log('Error, no se pudo modificar la ubicacion: ', err);
        throw err;
    }
}

async function update_many_locations_fields_by_display_name(names, attributes){
    try{
        await set_db_connection();
        const locations = await Location.updateMany({display_name: names}, {$set: attributes});
        console.log('Atributos de las localizaciones modificados.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo modificar las ubicaciones: ', err);
        throw err;
    }
}

async function update_location_fields_by_place_id(id, attributes){
    try{
        await set_db_connection();
        const location = await Location.findOneAndUpdate({place_id: id}, {$set: attributes}, {new: true});
        console.log('Atributos de ubicacion modificados.');
        return location;
    }catch(err){
        console.log('Error, no se pudo modificar la ubicacion: ', err);
        throw err;
    }
}

async function update_many_locations_fields_by_place_id(ids, attributes){
    try{
        await set_db_connection();
        const locations = await Location.updateMany({place_id: ids}, {$set: attributes});
        console.log('Atributos de las ubicaciones modificados.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo modificar las ubicaciones: ', err);
        throw err;
    }
}

async function update_many_locations_fields_by_query(query, attributes){
    try{
        await set_db_connection();
        const locations = await Location.updateMany(query, {$set: attributes});
        console.log('Atributos de las ubicaciones modificados.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo modificar las ubicaciones: ', err);
        throw err;
    }
}

async function update_all_locations_fields(attributes){
    try{
        await set_db_connection();
        const locations = await Location.updateMany({}, {$set: attributes});
        console.log('Atributos de las localizaciones modificados.');
        return locations;
    }catch(err){
        console.log('Error, no se pudo modificar las ubicaciones: ', err);
        throw err;
    }
}

//Citas:
//async function update_appointment_fields_by_display_name(){
    
//}

module.exports = {
    update_location_fields_by_display_name,
    update_many_locations_fields_by_display_name,
    update_location_fields_by_place_id,
    update_many_locations_fields_by_place_id,
    update_all_locations_fields,
    update_many_locations_fields_by_query
}