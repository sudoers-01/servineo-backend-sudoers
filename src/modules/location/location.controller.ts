import { Request, Response } from 'express';
import { searchLocation, reverseLocation } from './location.service';

const createModule = require('../controladores/CRUD_operations/create');
const readModule = require('../controladores/CRUD_operations/read');
const updateModule = require('../controladores/CRUD_operations/update');
const deleteModule = require('../controladores/CRUD_operations/delete');

const Location = require('../../models/Location');

export async function getLocation(req: Request, res: Response) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Missing query parameter: q" });
    }
    const data = await searchLocation(q as string);
    console.log(data);

    /*try {
      const test = await createModule.insert_one_location(data[0]);
      console.log("OK: " + test);
    } catch (error) {
      console.log("ERROR: " + error);
    }*/

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching location data" });
  }
}

export async function getAddress(req: Request, res: Response) {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: "Missing query parameters: lat and log" });
    }
    const data = await reverseLocation(lat as string, lon as string);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching address" });
  }
}
