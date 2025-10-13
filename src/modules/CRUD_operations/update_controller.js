require('express');
const {
    update_location_fields_by_display_name,
    update_many_locations_fields_by_display_name,
    update_location_fields_by_place_id,
    update_many_locations_fields_by_place_id,
    update_all_locations_fields,
    update_many_locations_fields_by_query
} = require('./update_service');

async function attributeValidation(attributes){
    if(attributes == null){
            return res.status(400).json({ message: 'Missing parameter: list of attributes to change.'});
    }else{
        Object.keys(attributes).forEach(key => {
            if(key === "place_id"){
                if(attributes[key] === ""){
                    return res.status(400).json({ message: 'Missing parameter value: place_id.'});
                }
                if(!(/^[0-9]{7}$/.test(attributes[key]))){
                    return res.status(400).json({ message: 'Wrong parameter value: place_id must be numbers.'});
                }
            }
            else if(key === "licence"){
                if(attributes[key] === ""){
                    return res.status(400).json({ message: 'Missing parameter value: licence.'});
                }
            }else if(key === "osm_type"){
                if(attributes[key] === ""){
                    return res.status(400).json({ message: 'Missing parameter value: osm_type.'});
                }
            }else if(key === "osm_id"){
                if(attributes[key] === ""){
                    return res.status(400).json({ message: 'Missing parameter value: osm_id.'});
                }
                if(attributes[key].length != 10 || !(/^[0-9]{9}$/.test(attributes[key]))){
                    return res.status(400).json({ message: 'Wrong parameter value: osm_id.'});
                }
            }else if(key === "lat"){
                if(attributes[key] === ""){
                    return res.status(400).json({ message: 'Missing parameter value: lat.'});
                }
                if(!(/^-?\d+\.\d{1-10}/.test(attributes[key]))){
                    return res.status(400).json({ message: 'Wrong parameter value: lat.'});
                }
            }else if(key === "lon"){
                if(attributes[key] === ""){
                    return res.status(400).json({ message: 'Missing parameter value: lon.'});
                }
                if(!(/^-?\d+\.\d{1-10}/.test(attributes[key]))){
                    return res.status(400).json({ message: 'Wrong parameter value: lon.'});
                }
            }else if(key === "display_name"){
                if(attributes[key] === ""){
                    return res.status(400).json({ message: 'Missing parameter value: display_name.'});
                }
            }else if(key === "address"){
                if(attributes[key] == null){
                    return res.status(400).json({ message: 'Missing parameter value: address.'});
                }
            }else if(key === "boundingbox"){
                if(attributes[key].length === 0 && attributes[key].length !== 4){
                    return res.status(400).json({ message: 'Missing parameter value: boundingbox.'});
                }
                if(!(/^-?\d+\.\d{1-10}/.test(attributes[key][0])) && (!(/^-?\d+\.\d{1-10}/.test(attributes[key][1]))) &&
                    (!(/^-?\d+\.\d{1-10}/.test(attributes[key][2]))) && (!(/^-?\d+\.\d{1-10}/.test(attributes[key][3])))){
                    return res.status(400).json({ message: 'Wrong parameter value: boundingbox.'});
                }
            }
        });
    }
}

export async function updateLocationFieldByDisplayName(req, res){
    try{
        const { name, attributes } = req.query;
        if(name !== ""){
            return res.status(400).json({ message: 'Missing parameter: name.'});  
        }
        attributeValidation(attributes);
        const data = await update_location_fields_by_display_name(name, attributes);
        console.log('Location data modified.', data);
        res.json();
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
        res.json();
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
        res.json();       
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
        res.json();       
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
        res.json();       
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
        res.json();
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error updating locations data." });
    }
}