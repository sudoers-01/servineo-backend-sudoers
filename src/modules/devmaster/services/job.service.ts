import { Job } from '../models/job.model';
import { getRangeRegex } from '../utils/nameRangeHelper';
import { validateAndNormalizeDepartment } from '../utils/departmentHelper';

export const getAllJobs = async () => {
  return await Job.find().sort({ createdAt: -1 });
};

export const getJobById = async (id: string) => {
  return await Job.findById(id);
};

export const getJobsByFixerNameRange = async (range: string) => {
  console.log('Buscando rango:', range);
  
  const regex = getRangeRegex(range);
  
  if (!regex) {
    throw new Error(`Rango inválido: ${range}`);
  }
  
  return await Job.find({
    fixerName: regex
  }).sort({ fixerName: 1 });
};

/**
 * Filtrar trabajos por departamento
 */
export const getJobsByDepartment = async (department: string) => {
  console.log('Buscando departamento:', department);
  
  const normalizedDepartment = validateAndNormalizeDepartment(department);
  
  return await Job.find({
    department: normalizedDepartment
  }).sort({ createdAt: -1 });
};

export const getJobsFiltered = async (filters: {
  nameRange?: string;
  department?: string;
  jobType?: string;
}) => {
  const query: any = {};
  
  if (filters.nameRange) {
    const regex = getRangeRegex(filters.nameRange);
    if (regex) {
      query.fixerName = regex;
    }
  }
  
  if (filters.department) {
    try {
      const normalizedDepartment = validateAndNormalizeDepartment(filters.department);
      query.department = normalizedDepartment;
    } catch (error) {
      throw error;
    }
  }
  
  if (filters.jobType) {
    query.jobType = filters.jobType;
  }
  
  return await Job.find(query).sort({ fixerName: 1, createdAt: -1 });
};