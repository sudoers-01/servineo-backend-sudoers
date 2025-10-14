import { Request, Response } from 'express';
import { 
  getAllJobs, 
  getJobById, 
  getJobsByFixerNameRange,
  getJobsFiltered 
} from '../services/job.service';
import { isValidRange } from '../utils/nameRangeHelper';

/**
 * GET /api/devmaster/jobs
 */
export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await getAllJobs();
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener los trabajos', 
      error 
    });
  }
};

/**
 * GET /api/devmaster/jobs/:id
 */
export const getJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await getJobById(id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Trabajo no encontrado' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener el trabajo', 
      error 
    });
  }
};

/**
 * GET /api/devmaster/jobs/filterByFixerNameRange?range=A-C
 */
export const filterJobsByFixerNameRange = async (req: Request, res: Response) => {
  try {
    const { range } = req.query;

    if (!range) {
      return res.status(400).json({
        success: false,
        error: "Debes especificar un rango",
        validRanges: ['A-C', 'D-F', 'G-I', 'J-L', 'M-Ñ', 'O-Q', 'R-T', 'U-W', 'X-Z']
      });
    }

    if (!isValidRange(range as string)) {
      return res.status(400).json({
        success: false,
        error: `Rango inválido: ${range}`,
        validRanges: ['A-C', 'D-F', 'G-I', 'J-L', 'M-Ñ', 'O-Q', 'R-T', 'U-W', 'X-Z']
      });
    }

    const jobs = await getJobsByFixerNameRange(range as string);
    
    res.json({
      success: true,
      range,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al filtrar trabajos por rango",
      details: error,
    });
  }
};

/**
 * GET /api/devmaster/jobs/filter?range=A-C&department=La Paz&jobType=Fontanero
 */
export const filterJobs = async (req: Request, res: Response) => {
  try {
    const { range, department, jobType } = req.query;

    const filters: any = {};
    if (range) filters.nameRange = range as string;
    if (department) filters.department = department as string;
    if (jobType) filters.jobType = jobType as string;

    const jobs = await getJobsFiltered(filters);
    
    res.json({
      success: true,
      filters,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al filtrar trabajos",
      details: error,
    });
  }
};