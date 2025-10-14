import { Request, Response } from 'express';
import { getAllFixers } from '../services/sort.service';
import { SortCriteria, DEFAULT_SORT_CONFIG } from '../utils/queryParams.types';

export const getFixers = async (req: Request, res: Response) => {
  try {
    const sortBy = (req.query.sortBy as SortCriteria) || DEFAULT_SORT_CONFIG.sortBy;
    const result = await getAllFixers({ sortBy });
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error al obtener fixers' });
  }
};
