import { Request, Response } from 'express';
import { getAllOffers, getOffersFiltered } from '../services/jobOfert.service';
import { SortCriteria } from '../types/sort.types';
import { saveSearchToHistory } from '../services/jobOfert/search-history.service';

export const getOffers = async (req: Request, res: Response) => {
  try {
    const { range, city, category, search, sortBy, limit, skip, page, sessionId } = req.query;

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
    options.limit = itemsPerPage;

    if (page && !isNaN(Number(page))) {
      options.skip = (Number(page) - 1) * itemsPerPage;
    } else if (skip && !isNaN(Number(skip))) {
      options.skip = Number(skip);
    } else {
      options.skip = 0;
    }

    // Llamar al service unificado
    const result = await getOffersFiltered(options);

    if (search && typeof search === 'string' && search.trim()) {
      const sid = typeof sessionId === 'string' ? sessionId : undefined;
      // AHORA SÍ: llamar a saveSearchToHistory para GUARDAR
      saveSearchToHistory(search.trim(), sid).catch((error) => {
      console.error('Error saving search to history:', error);
      });
    }

    res.status(200).json({
      success: true,
      count: result.count,
      total: result.count,
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
