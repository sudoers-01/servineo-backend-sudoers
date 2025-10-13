require ("express");
const {
    create_location,
    insert_one_location,
    insert_many_locations,
    create_appointment,
    insert_one_appointment,
    insert_many_appointments
} = require('./create_service');
const {
    attributeValidation,
    dataExist
} = require('./common_functions');

export async function createLocation(req, res){
    try{
        const { current_location } = req.query;
        if(!current_location){
            return res.status(400).json({error: 'Missing parameter: current_location.'});
        }
    }catch(err){
        console.log('Error in controller while creating location: ', err);
        res.status(500).json({error: 'Server error'});
    }
}
export async function insertOneLocation(req, res){
    try{
        const { current_location } = req.query;
        if(!current_location){
            return res.status(400).json({error: 'Missing parameter: current_location.'});
        }
    }catch(err){
        console.log('Error in controller while inserting one location: ', err);
        res.status(500).json({error: 'Server error'});
    }
}    
export async function insertManyLocations(req, res){
    try{
        const { locations } = req.query;
        if(!locations){
            return res.status(400).json({error: 'Missing parameter: locations.'});
        }
    }catch(err){
        console.log('Error in controller while inserting many locations: ', err);
        res.status(500).json({error: 'Server error'});
    }  
}
export async function createAppointment(req, res){
    try{
        const { current_appointment } = req.query;
        if(!current_appointment){
            return res.status(400).json({error: 'Missing parameter: current_appointment.'});
        }
    }catch(err){
        console.log('Error in controller while creating appointment: ', err);
        res.status(500).json({error: 'Server error'});
    }
}

export async function insertOneAppointment(req, res){
    try{
        const { current_appointment } = req.query;
        if(!current_appointment){
            return res.status(400).json({error: 'Missing parameter: current_appointment.'});
        }
    }catch(err){
        console.log('Error in controller while inserting one appointment: ', err);
        res.status(500).json({error: 'Server error'});
    }
}
export async function insertManyAppointments(req, res){
    try{
        const { appointments } = req.query;
        if(!appointments){
            return res.status(400).json({error: 'Missing parameter: appointments.'});
        }
    }catch(err){
        console.log('Error in controller while inserting many appointments: ', err);
        res.status(500).json({error: 'Server error'});
    }  
}

