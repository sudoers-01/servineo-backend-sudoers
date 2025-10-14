import 'express';
import {
  create_location,
  insert_one_location,
  insert_many_locations,
  create_appointment,
  insert_one_appointment,
  insert_many_appointments,
  create_appointment_with_fixer_requester,
  insert_one_appointment_with_fixer_requester,
  insert_many_appointments_with_fixers_requesters,
} from './create_service';
import { dataExist } from './common_functions';

export async function createLocation(req, res) {
  try {
    const { current_location } = req.query;
    if (!current_location) {
      return res.status(400).json({ message: 'Missing parameter: current_location.' });
    }
    const data = await create_location(current_location);
    const output_fail = 'Could not create location data.';
    const output_success = 'Location data created correctly. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating location data.' });
  }
}

export async function insertOneLocation(req, res) {
  try {
    const { current_location } = req.query;
    if (!current_location) {
      return res.status(400).json({ message: 'Missing parameter: current_location.' });
    }
    const data = await insert_one_location(current_location);
    const output_fail = 'Could not insert location data.';
    const output_success = 'Location data inserted correctly. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error inserting location data.' });
  }
}

export async function insertManyLocations(req, res) {
  try {
    const { locations } = req.query;
    if (locations.length === 0) {
      return res.status(400).json({ message: 'Missing parameter: list of locations.' });
    }
    const data = await insert_many_locations(locations);
    const output_fail = 'Could not insert locations data.';
    const output_success = 'Locations data inserted correctly. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating location data' });
  }
}

export async function createAppointment(req, res) {
  try {
    const { current_appointment } = req.query;
    if (!current_appointment) {
      return res.status(400).json({ message: 'Missing parameter: current_appointment.' });
    }
    const data = await create_appointment(current_appointment);
    const output_fail = 'Could not create appointment data.';
    const output_success = 'Appointment data created correctly. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating appointment data.' });
  }
}

export async function insertOneAppointment(req, res) {
  try {
    const { current_appointment } = req.query;
    if (!current_appointment) {
      return res.status(400).json({ message: 'Missing parameter: current_appointment.' });
    }
    const data = await insert_one_appointment(current_appointment);
    const output_fail = 'Could not insert appointment data.';
    const output_success = 'Appointments data inserted correctly. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error inserting appointment data.' });
  }
}

export async function insertManyAppointments(req, res) {
  try {
    const { appointments } = req.query;
    if (appointments.length === 0) {
      return res.status(400).json({ message: 'Missing parameters: list of appointments.' });
    }
    const data = await insert_many_appointments(appointments);
    const output_fail = 'Could not insert appointments data.';
    const output_success = 'Appointments data inserted correctly. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error inserting many appointment data.' });
  }
}

export async function createAppointmentWithFixerRequester(req, res) {
  try {
    const { fixer_id, requester_id, appointment_data } = req.body;
    if (!fixer_id || !requester_id || !appointment_data) {
      return res
        .status(400)
        .json({ message: 'Missing parameters: fixer_id, requester_id or appointment_data.' });
    }
    const data = await create_appointment_with_fixer_requester(
      fixer_id,
      requester_id,
      appointment_data,
    );
    const output_fail = 'Appointment could not be created.';
    const output_success = 'Appointment created. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating appointment.' });
  }
}

export async function insertOneAppointmentWithFixerRequester(req, res) {
  try {
    const { fixer_id, requester_id, appointment_data } = req.body;
    if (!fixer_id || !requester_id || !appointment_data) {
      return res
        .status(400)
        .json({ message: 'Missing parameters: fixer_id, requester_id or appointment_data' });
    }
    const data = await insert_one_appointment_with_fixer_requester(
      fixer_id,
      requester_id,
      appointment_data,
    );
    const output_fail = 'Appointment could not be inserted.';
    const output_success = 'Appointment inserted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error inserting appointment.' });
  }
}

export async function insertManyAppointmentsWithFixersRequesters(req, res) {
  try {
    const { appointments_data } = req.body;
    if (!appointments_data) {
      return res.status(400).json({ message: 'Missing parameter: appointments_data.' });
    }
    const data = await insert_many_appointments_with_fixers_requesters(appointments_data);
    const output_fail = 'Appointments could not be inserted.';
    const output_success = 'Appointments inserted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error inserting appointments.' });
  }
}
