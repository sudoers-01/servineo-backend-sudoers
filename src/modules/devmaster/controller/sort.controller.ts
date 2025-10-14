// src/modules/devmaster/controller/sort.controller.ts
import { Request, Response } from 'express';
import { getAllFixers } from '../services/sort.service';
import { SortCriteria, DEFAULT_SORT_CONFIG } from '../utils/queryParams.types';
import { createErrorResponse, logError } from '../utils/errorHandler';

/**
 * Obtener lista de fixers con ordenamiento
 */
export const getFixers = async (req: Request, res: Response) => {
  try {
    const sortByQuery = (req.query.sortBy as string)?.toLowerCase() || DEFAULT_SORT_CONFIG.sortBy;

    // Validar que sortBy sea un valor permitido
    const validSortValues = Object.values(SortCriteria);
    const sortBy = validSortValues.includes(sortByQuery as SortCriteria)
      ? (sortByQuery as SortCriteria)
      : DEFAULT_SORT_CONFIG.sortBy;

    const result = await getAllFixers({ sortBy });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logError(error, 'getFixers');
    return res.status(500).json(createErrorResponse(error, 'Error al obtener fixers'));
  }
};
