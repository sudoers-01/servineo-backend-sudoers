import { Request, Response } from 'express';
import * as jobRequestService from './job-request.service';
import { ObjectId } from 'mongodb';

export async function getAllJobRequests(req: Request, res: Response) {
  try {
    const jobs = await jobRequestService.getAllJobRequests(req.db);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching job requests:', error);
    res.status(500).json({ message: 'Error fetching job requests' });
  }
}

export async function getJobRequestById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const job = await jobRequestService.getJobRequestById(req.db, id);

    if (!job) return res.status(404).json({ message: 'Job request not found' });
    res.json(job);
  } catch (error) {
    console.error('Error fetching job request:', error);
    res.status(500).json({ message: 'Error fetching job request' });
  }
}

export async function createJobRequest(req: Request, res: Response) {
  try {
    const jobRequestData = req.body;
    const { requesterId } = jobRequestData;

    if (!requesterId) {
      return res.status(400).json({ message: 'requesterId is required' });
    }

    if (
      !(ObjectId.isValid(requesterId) && new ObjectId(requesterId).toHexString() === requesterId)
    ) {
      return res.status(422).json({ error: 'Invalid requester ID format' });
    }

    const newJobRequest = await jobRequestService.createJobRequest(
      req.db,
      jobRequestData,
      requesterId,
    );

    res.status(201).json(newJobRequest);
  } catch (error) {
    console.error('Error creating job request:', error);
    res.status(500).json({ message: 'Error creating job request' });
  }
}
