require('express');
const {
    update_location_fields_by_display_name,
    update_many_locations_fields_by_display_name,
    update_location_fields_by_place_id,
    update_many_locations_fields_by_place_id,
    update_all_locations_fields,
    update_many_locations_fields_by_query
} = require('./update_service');
const attributeValidation = require('./common_functions');

export async function updateLocationFieldsByDisplayName(req, res){
    try{
        const { name, attributes } = req.query;
        if(name !== ""){
            return res.status(400).json({ message: 'Missing parameter: name.'});  
        }
        attributeValidation(attributes);
        const data = await update_location_fields_by_display_name(name, attributes);
        console.log('Location data modified.', data);
        res.json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating location data." });
    }
}

 export async function updateManyLocationsFieldsByDisplayName(req, res){
    try{
        const { name, attributes } = req.query;
        if(name !== ""){
            return res.status(400).json({ message: 'Missing parameter: name'});  
        }
        attributeValidation(attributes);
        const data = await update_many_locations_fields_by_display_name(name, attributes);
        console.log('Locations data modified.', data);
        res.json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });
    }
}

export async function updateLocationFieldsByPlaceId(){
    try{
        const { id, attributes } = req.query;
        if(id !== ""){
            return res.status(400).json({ message: 'Missing parameter: name'});  
        }
        if(!(/^[0-9]{7}$/.test(id))){
            return res.status(400).json({ message: 'Wrong parameter value: place_id must be 7 numbers.'});
        }
        attributeValidation(attributes);
        const data = await update_location_fields_by_place_id(id, attributes);
        console.log('Location data modified.', data);
        res.json(data);       
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating location data." });       
    }
}

export async function updateManyLocationsFieldsByPlaceId(){
    try{
        const { id, attributes } = req.query;
        if(id !== ""){
            return res.status(400).json({ message: 'Missing parameter: name'});  
        }
        if(!(/^[0-9]{7}$/.test(id))){
            return res.status(400).json({ message: 'Wrong parameter value: place_id must be 7 numbers.'});
        }
        attributeValidation(attributes);
        const data = await update_many_locations_fields_by_place_id(id, attributes);
        console.log('Locations data modified.', data);
        res.json(data);       
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });       
    }
}

export async function updateAllLocationsFields(){
    try{
        const { attributes } = req.query;
        attributeValidation(attributes);
        const data = await update_all_locations_fields(id, attributes);
        console.log('Locations data modified.', data);
        res.json(data);       
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });       
    }    
}

export async function updateManyLocationsFieldsByQuery(){
    try{
        const { query, attributes } = req.query;
        attributeValidation(query);
        attributeValidation(attributes);
        const data = await update_many_locations_fields_by_query(query, attributes);
        console.log('Locations data modified.', data);
        res.json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });
    }
}