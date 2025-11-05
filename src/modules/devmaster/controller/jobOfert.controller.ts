import { Request, Response } from 'express';
import { getAllOffers, getOffersFiltered } from '../services/jobOfert.service';
import { SortCriteria } from '../types/sort.types';
import {
  validatePageRange,
  normalizePageParam,
  calculatePaginationParams,
  validatePaginationConsistency,
} from '../utils/pagination.validator';

export const getOffers = async (req: Request, res: Response) => {
  try {
    const { range, city, category, search, sortBy, limit, skip, page } = req.query;

    // Si no hay query params, retorna todas
    if (!range && !city && !category && !search && !sortBy && !limit && !skip && !page) {
      const offers = await getAllOffers();
      return res.status(200).json({
        success: true,
        count: offers.length,
        total: offers.length,
        data: offers,
      });
    }

    // Preparar opciones para el service
    const options: any = {};

    if (range) options.ranges = Array.isArray(range) ? range.map(String) : [String(range)];
    if (city && typeof city === 'string') options.city = city;
    if (category)
      options.categories = Array.isArray(category) ? category.map(String) : [String(category)];
    if (search && typeof search === 'string') options.search = search.trim();

    if (sortBy && typeof sortBy === 'string') {
      const validSorts = Object.values(SortCriteria).map((v) => v.toLowerCase());
      if (validSorts.includes(sortBy.toLowerCase())) options.sortBy = sortBy.toLowerCase();
    }

    // Paginación
    const itemsPerPage = limit && !isNaN(Number(limit)) ? Number(limit) : 10;
    const currentPage = normalizePageParam(page);

    // Calcular skip y limit de forma consistente
    const paginationParams = calculatePaginationParams(currentPage, itemsPerPage);
    options.limit = paginationParams.limit;
    options.skip = paginationParams.skip;

    // Llamar al service unificado
    const result = await getOffersFiltered(options);

    // Validar página fuera de rango
    const validation = validatePageRange(currentPage, result.count, itemsPerPage);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errorMessage,
        totalPages: validation.totalPages,
        currentPage: validation.currentPage,
        total: result.count,
      });
    }

    res.status(200).json({
      success: true,
      count: result.count,
      total: result.count,
      currentPage: validation.currentPage,
      totalPages: validation.totalPages,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ofertas',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
