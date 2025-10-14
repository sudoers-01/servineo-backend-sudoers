import 'express';
import {
  delete_location_by_display_name,
  delete_many_locations_by_display_name,
  delete_location_by_place_id,
  delete_many_locations_by_place_id,
  delete_many_locations_by_query,
  delete_appointment_by_id,
  delete_many_appointments_by_ids,
  delete_appointment_by_fixer_id,
  delete_many_appointments_by_fixer_id,
  delete_appointment_by_requester_id,
  delete_many_appointments_by_requester_id,
  delete_appointments_by_query,
  delete_all_appointments,
} from './delete_service';
import { locationAttributeValidation, dataExist } from './common_functions';

export async function deleteLocationByDisplayName(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'Missing parameter: name.' });
    }
    const data = await delete_location_by_display_name(name);
    const output_fail = 'No location data found, cant delete location.';
    const output_success = 'Location data deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log('Error in controller while deleting location: ', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteManyLocationsByDisplayName(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'Missing parameter: name.' });
    }
    const data = await delete_many_locations_by_display_name(name);
    const output_fail = 'No locations data found, cant delete locations.';
    const output_success = 'Locations data deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteLocationByPlaceId(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing parameter: id' });
    }
    if (/^[0-9]{7}$/.test('id')) {
      return res.status(400).json({ error: 'Invalid parameter: id is not valid' });
    }
    const data = await delete_location_by_place_id(id);
    const output_fail = 'No location data found, cant delete location.';
    const output_success = 'Location data deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}
export async function deleteManyLocationsByPlaceId(req, res) {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: 'Missing parameter: ids' });
    }
    if (/^[0-9]{7}$/.test('ids')) {
      return res.status(400).json({ error: 'Invalid parameter: id is not valid' });
    }
    const data = await delete_many_locations_by_place_id(ids);
    const output_fail = 'No locations data found, cant delete locations.';
    const output_success = 'Locations data deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteManyLocationsByQuery(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Missing query in request body.' });
    }
    locationAttributeValidation(query);
    const data = await delete_many_locations_by_query(query);
    const output_fail = 'No locations data found by query, cant delete locations.';
    const output_success = 'Locations data deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Controladores para appointments (delete)
export async function deleteAppointmentById(req, res) {
  try {
    const { id } = req.query;
    if (id === '') {
      return res.status(400).json({ message: 'Missing parameter: id.' });
    }
    const data = await delete_appointment_by_id(id);
    const output_fail = 'Appointment could not be deleted.';
    const output_success = 'Appointment deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting appointment.' });
  }
}

export async function deleteManyAppointmentsByIds(req, res) {
  try {
    const { ids } = req.query;
    if (ids === '') {
      return res.status(400).json({ message: 'Missing parameter: ids' });
    }
    const data = await delete_many_appointments_by_ids(ids);
    const output_fail = 'Appointments could not be deleted.';
    const output_success = 'Appointments deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting appointments.' });
  }
}

export async function deleteAppointmentByFixerId(req, res) {
  try {
    const { fixer_id } = req.query;
    if (fixer_id === '') {
      return res.status(400).json({ message: 'Missing parameter: fixer_id.' });
    }
    const data = await delete_appointment_by_fixer_id(fixer_id);
    const output_fail = 'Appointment could not be deleted.';
    const output_success = 'Appointment deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting appointment.' });
  }
}

export async function deleteManyAppointmentsByFixerId(req, res) {
  try {
    const { fixer_id } = req.query;
    if (fixer_id === '') {
      return res.status(400).json({ message: 'Missing parameter: fixer_id' });
    }
    const data = await delete_many_appointments_by_fixer_id(fixer_id);
    const output_fail = 'Appointments could not be deleted.';
    const output_success = 'Appointments deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting appointments.' });
  }
}

export async function deleteAppointmentByRequesterId(req, res) {
  try {
    const { requester_id } = req.query;
    if (requester_id === '') {
      return res.status(400).json({ message: 'Missing parameter: requester_id.' });
    }
    const data = await delete_appointment_by_requester_id(requester_id);
    const output_fail = 'Appointment could not be deleted.';
    const output_success = 'Appointment deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting appointment.' });
  }
}

export async function deleteManyAppointmentsByRequesterId(req, res) {
  try {
    const { requester_id } = req.query;
    if (requester_id === '') {
      return res.status(400).json({ message: 'Missing parameter: requester_id' });
    }
    const data = await delete_many_appointments_by_requester_id(requester_id);
    const output_fail = 'Appointments could not be deleted.';
    const output_success = 'Appointments deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting appointments.' });
  }
}

export async function deleteAppointmentsByQuery(req, res) {
  try {
    const { query } = req.query;
    const data = await delete_appointments_by_query(query);
    const output_fail = 'Appointments could not be deleted.';
    const output_success = 'Appointments deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting appointments.' });
  }
}

export async function deleteAllAppointments(req, res) {
  try {
    const data = await delete_all_appointments();
    const output_fail = 'Appointments could not be deleted.';
    const output_success = 'All appointments deleted. ';
    await dataExist(data, output_fail, output_success, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting appointments.' });
  }
}
