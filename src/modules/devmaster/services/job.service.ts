import { Job } from '../models/job.model';
import { getRangeRegex } from '../utils/nameRangeHelper';

export const getAllJobs = async () => {
  return await Job.find().sort({ createdAt: -1 });
};

export const getJobById = async (id: string) => {
  return await Job.findById(id);
};

export const getJobsByFixerNameRange = async (range: string) => {
  console.log('Buscando rango:', range); // ← Solo este queda
  
  const regex = getRangeRegex(range);
  
  if (!regex) {
    throw new Error(`Rango inválido: ${range}`);
  }
  
  return await Job.find({
    fixerName: regex
  }).sort({ fixerName: 1 });
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
    query.department = filters.department;
  }
  
  if (filters.jobType) {
    query.jobType = filters.jobType;
  }
  
  return await Job.find(query).sort({ fixerName: 1, createdAt: -1 });
};
