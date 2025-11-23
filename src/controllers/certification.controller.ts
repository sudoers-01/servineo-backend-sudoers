import { Request, Response } from 'express';
import { Certification } from '../models/certification.model';

export const createCertification = async (req: Request, res: Response) => {
  try {
    const certification = new Certification(req.body);
    await certification.save();
    res.status(201).json(certification);
  } catch (error) {
    res.status(400).json({ message: 'Error creating certification', error });
  }
};

export const getCertificationsByFixerId = async (req: Request, res: Response) => {
  try {
    const { fixerId } = req.params;
    const certifications = await Certification.find({ fixerId });
    res.status(200).json(certifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certifications', error });
  }
};

export const updateCertification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findByIdAndUpdate(id, req.body, { new: true });
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.status(200).json(certification);
  } catch (error) {
    res.status(400).json({ message: 'Error updating certification', error });
  }
};

export const deleteCertification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findByIdAndDelete(id);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.status(200).json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting certification', error });
  }
};
