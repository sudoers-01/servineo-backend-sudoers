import { Request, Response } from 'express';
import { getAllOffers, getOffersFiltered } from '../services/jobOfert.service';
import { SortCriteria } from '../types/sort.types';
// ⚠️ 1. IMPORTACIÓN DEL MODELO REAL
import { Offer } from '../models/offer.model';
export const getOffers = async (req: Request, res: Response) => {
  try {
    const { range, city, category, search, sortBy, limit, skip, page, tags, minPrice, maxPrice } =
      req.query;

    // Si no hay query params, retorna todas
    if (
      !range &&
      !city &&
      !category &&
      !search &&
      !sortBy &&
      !limit &&
      !skip &&
      !page &&
      !tags &&
      !minPrice &&
      !maxPrice
    ) {
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
    // ADD: activar modo exact cuando el frontend envía ?exact=true
    if (req.query.exact === 'true' || req.query.exact === '1') {
      options.searchMode = 'exact';
      // Forzamos búsqueda en title + description si exact=true
      options.searchFields = ['title', 'description'];
    }

    // 2. AÑADIR LOS NUEVOS FILTROS
    if (tags) options.tags = Array.isArray(tags) ? tags.map(String) : String(tags);
    if (minPrice && typeof minPrice === 'string') options.minPrice = minPrice;
    if (maxPrice && typeof maxPrice === 'string') options.maxPrice = maxPrice;

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
/**
 * Función controladora para obtener todas las etiquetas únicas de la DB.
 * Usamos 'export' para que el router pueda importarla.
 */
export const getUniqueTags = async (req: Request, res: Response) => {
  try {
    // Usa el modelo 'Offer' que importaste.
    const uniqueTags: string[] = await Offer.distinct('tags'); // El error no está aquí, sino en la carga del módulo.

    // ...
    res.status(200).json(uniqueTags);
  } catch (error) {
    // ...
    res.status(500).json({
      message: 'Error interno al obtener etiquetas',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
