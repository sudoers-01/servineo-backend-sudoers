import { searchLocation, reverseLocation } from '../../services/location/location.service.js';

export async function getLocation(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Missing query parameter: q' });
    }
    const data = await searchLocation(q);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching location data' });
  }
}

export async function getAddress(req, res) {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Missing query parameters: lat and log' });
    }
    const data = await reverseLocation(lat, lon);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching address' });
  }
}
