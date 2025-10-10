// src/modules/devmaster/controller/sort.controller.ts
import { Request, Response } from 'express';
import { getAllFixers } from '../services/sort.service';

type SortBy = 'name_asc' | 'name_desc' | 'recent';

export const getFixers = async (req: Request, res: Response) => {
  try {
    const sortBy = (req.query.sortBy as SortBy) || 'recent';
    const result = await getAllFixers({ sortBy });
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Error al obtener fixers' });
  }
};
