const location_keys = ["place_id", "licence", "osm_type", "osm_id", "lat", "lon", "display_name", "address", "bounding_box"];

const appointment_keys =["id_fixer", "id_requester","selected_date","starting_time",
                        "finishing_time","current_requester_name","current_requester_phone",
                        "appointment_type","apointment_description","place_id","link_id" ];


async function locationAttributeValidation(attributes, res){
    if(attributes == null){
        return res.status(400).json({ message: 'Missing parameter: list of attributes to change.'});
    }else{
        locationQueryValidation(attributes, res);
    }
}

async function locationQueryValidation(query, res){
    Object.keys(query).forEach(key => {
        if(!location_keys.includes(key)){
            return res.status(400).json({ message: 'Wrong query attribute.'});
        }
        if(location_keys.includes(key)){
            if(!query[key]){
                return res.status(400).json({ message: 'Missing parameter value.'});
            }
        }
        if(key === "place_id"){
            if(!(/^[0-9]{7}$/.test(query[key]))){
                return res.status(400).json({ message: 'Wrong parameter value: place_id must be 7 numbers.'});
            }
        }
        if(key === "osm_id"){
            if(query[key].length != 10 || !(/^[0-9]{9}$/.test(query[key]))){
                return res.status(400).json({ message: 'Wrong parameter value: osm_id.'});
            }
        }
        if(key === "lat" || key == "lon"){
            if(!(/^-?\d+\.\d{1-10}/.test(query[key]))){
                return res.status(400).json({ message: 'Wrong parameter value: lat.'});
            }
        }
        if(key === "address"){
            if(query[key] == null){
                return res.status(400).json({ message: 'Missing parameter value: address.'});
            }
        }
        if(key === "boundingbox"){
            if(query[key].length === 0 && query[key].length !== 4){
                return res.status(400).json({ message: 'Missing parameter value: boundingbox.'});
            }
            if(!(/^-?\d+\.\d{1-10}/.test(query[key][0])) && (!(/^-?\d+\.\d{1-10}/.test(query[key][1]))) &&
                (!(/^-?\d+\.\d{1-10}/.test(query[key][2]))) && (!(/^-?\d+\.\d{1-10}/.test(query[key][3])))){
                return res.status(400).json({ message: 'Wrong parameter value: boundingbox.'});
            }
        }
    });
}


async function appointmentQueryValidation(query, res){
    Object.keys(query).forEach(key => {
        // Verifica si la key está dentro de la lista permitida
        if(!appointment_keys.includes(key)){
            return res.status(400).json({ message: 'Wrong query attribute.'});
        }
        
        // Verifica que los parámetros obligatorios tengan valor
        if(appointment_keys.includes(key) && key !== "place_id" && key !== "link_id"){
            if(!query[key]){
                return res.status(400).json({ message: 'Missing parameter value.'});
            }
        }

        // Validaciones específicas para cada parámetro
        if(key === "current_requester_phone"){
            if(!(/^\+?[1-9]\d{1,14}$/.test(query[key])) || query[key].length != 8){
                return res.status(400).json({ message: 'Wrong parameter value: current_requester_phone.'});
            }
        }

        // if(key === "id_fixer" || key === "id_requester"){
        //     if(!(/^[a-zA-Z0-9]{1,50}$/.test(query[key]))){
        //         return res.status(400).json({ message: `Wrong parameter value: ${key}.`});
        //     }
        // }

        if(key === "selected_date" || key === "starting_time" || key === "finishing_time"){
            if(!(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(query[key]))){
                return res.status(400).json({ message: `Wrong parameter value: ${key} must be in ISO format.`});
            }
            
            // Validación adicional para fechas futuras
            const date = new Date(query[key]);
            if(date <= new Date()){
                return res.status(400).json({ message: `Wrong parameter value: ${key} must be a future date.`});
            }
        }

        if(key === "current_requester_name"){
            if(!(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(query[key]))){
                return res.status(400).json({ message: 'Wrong parameter value: current_requester_name.'});
            }
        }

        // if(key === "appointment_type"){
        //     const validTypes = ["virtual", "presencial"];
        //     if(!validTypes.includes(query[key])){
        //         return res.status(400).json({ message: 'Wrong parameter value: appointment_type must be "virtual" or "presencial".'});
        //     }
            
        //     // Validación específica según el tipo de cita
        //     if(query[key] === "presencial" && !query["place_id"]){
        //         return res.status(400).json({ message: 'Missing parameter: place_id is required for presencial appointments.'});
        //     }
            
        //     if(query[key] === "virtual" && !query["link_id"]){
        //         return res.status(400).json({ message: 'Missing parameter: link_id is required for virtual appointments.'});
        //     }
        // }

        if(key === "appointment_description"){
            if(query[key].length <= 0 || query[key].length > 500){
                return res.status(400).json({ message: 'Wrong parameter value: appointment_description must be between 5 and 500 characters.'});
            }
        }

        if(key === "place_id"){
            // place_id es requerido solo para citas presenciales
            if(query["appointment_type"] === "presencial" && !query[key]){
                return res.status(400).json({ message: 'Missing parameter value: place_id.'});
            }
            if(query[key] && !(/^[a-zA-Z0-9]{1,50}$/.test(query[key]))){
                return res.status(400).json({ message: 'Wrong parameter value: place_id.'});
            }
        }

        if(key === "link_id"){
            // link_id es requerido solo para citas virtuales
            if(query["appointment_type"] === "virtual" && !query[key]){
                return res.status(400).json({ message: 'Missing parameter value: link_id.'});
            }
            if(query[key] && !(/^https?:\/\/.+\..+/.test(query[key]))){
                return res.status(400).json({ message: 'Wrong parameter value: link_id must be a valid URL.'});
            }
        }

        // Validación de consistencia entre tiempos
        // if(key === "starting_time" && query["finishing_time"]){
        //     const startTime = new Date(query["starting_time"]);
        //     const finishTime = new Date(query["finishing_time"]);
            
        //     if(finishTime <= startTime){
        //         return res.status(400).json({ message: 'Wrong parameter value: finishing_time must be after starting_time.'});
        //     }
            
        //     // Validar que la duración no exceda un límite razonable (ej. 8 horas)
        //     const duration = (finishTime - startTime) / (1000 * 60 * 60); // duración en horas
        //     if(duration > 8){
        //         return res.status(400).json({ message: 'Wrong parameter value: appointment duration cannot exceed 8 hours.'});
        //     }
        // }
    });

    // Validaciones adicionales después de recorrer todas las keys
    if(query["appointment_type"] === "presencial" && query["link_id"]){
        return res.status(400).json({ message: 'Wrong parameter: link_id should not be provided for presencial appointments.'});
    }

    if(query["appointment_type"] === "virtual" && query["place_id"]){
        return res.status(400).json({ message: 'Wrong parameter: place_id should not be provided for virtual appointments.'});
    }
}


async function dataExist(data, output_fail, output_success){
    if(!data || data.length === 0){
      return res.status(404).json({ message: output_fail });
    }
    console.log(output_success, data);
    res.json(data);
}

async function locationProjectionValidation(projection, res){
    const location_keys = ['place_id', 'license', 'osm_type', 'osm_id', 'lat', 'lon', 'display_name', 'address', 'bounding_box'];
    Object.keys(projection).forEach(key => {
        if(!location_keys.includes(key)){
            return res.status(400).json({ message: 'Wrong projection attribute introduced.' })
        }
        if(!projection[key] || (typeof projection[key] !== 'boolean')){
            return res.status(400).json({ message: 'Missing projection attribute value or wrong projection attribute type value.' });
        }
    });        
}

module.exports = {
    locationAttributeValidation,
    locationQueryValidation,
    dataExist,
    locationProjectionValidation
};
