import 'express';
import {
    update_location_fields_by_display_name,
    update_many_locations_fields_by_display_name,
    update_location_fields_by_place_id,
    update_many_locations_fields_by_place_id,
    update_all_locations_fields,
    update_many_locations_fields_by_query
} from './update_service';
import { 
    attributeValidation,
    dataExist
} from './common_functions';

export async function updateLocationFieldsByDisplayName(req, res){
    try{
        const { name, attributes } = req.query;
        if(name !== ""){
            return res.status(400).json({ message: 'Missing parameter: name.'});  
        }
        attributeValidation(attributes);
        const data = await update_location_fields_by_display_name(name, attributes);
        const output_fail = 'Location data could not modified.';
        const output_success = 'Location data modified. ';
        dataExist(data, output_fail, output_success);
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
        const output_fail = 'Locations data could not modified.';
        const output_success = 'Locations data modified. ';
        dataExist(data, output_fail, output_success);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });
    }
}

export async function updateLocationFieldsByPlaceId(res, req){
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
        const output_fail = 'Location data could not modified.';
        const output_success = 'Location data modified. ';
        dataExist(data, output_fail, output_success);   
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating location data." });       
    }
}

export async function updateManyLocationsFieldsByPlaceId(res, req){
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
        const output_fail = 'Locations data could not modified.';
        const output_success = 'Locations data modified. ';
        dataExist(data, output_fail, output_success);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });       
    }
}

export async function updateAllLocationsFields(res, req){
    try{
        const { attributes } = req.query;
        attributeValidation(attributes);
        const data = await update_all_locations_fields(attributes);
        const output_fail = 'Locations data could not modified.';
        const output_success = 'Locations data modified. ';
        dataExist(data, output_fail, output_success);  
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });       
    }    
}

export async function updateManyLocationsFieldsByQuery(res, req){
    try{
        const { query, attributes } = req.query;
        attributeValidation(query);
        attributeValidation(attributes);
        const data = await update_many_locations_fields_by_query(query, attributes);
        const output_fail = 'Locations data could not modified.';
        const output_success = 'Locations data modified. ';
        dataExist(data, output_fail, output_success); 
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });
    }
}