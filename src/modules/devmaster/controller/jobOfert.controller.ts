import { Request, Response } from 'express';
import { getAllOffers, getOffersFiltered, getPriceRanges } from '../services/jobOfert.service';
import { SortCriteria } from '../types/sort.types';
import { Offer } from '../models/offer.model';

export const getOffers = async (req: Request, res: Response) => {
  try {
    const {
      range,
      city,
      category,
      search,
      sortBy,
      // alias 'sort' is accepted from frontend in some places — normalize below
      sort,
      limit,
      skip,
      page,
      tags,
      minPrice,
      maxPrice,
      action,
    } = req.query;

    // Acción especial: devolver rangos de precio calculados dinámicamente
    if (action === 'getPriceRanges') {
      const buckets = typeof req.query.buckets === 'string' ? parseInt(req.query.buckets, 10) : 4;
      const includeExtremes = req.query.includeExtremes !== 'false';
      try {
        const result = await getPriceRanges(buckets, includeExtremes);
        return res.status(200).json({ success: true, ...result });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Error obteniendo rangos de precio',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Si no hay query params relevantes, retorna todas
    // NOTE: incluimos 'date' en la comprobación para evitar que una llamada
    // con sólo ?date=YYYY-MM-DD devuelva todas las ofertas sin filtrar.
    if (
      !range &&
      !city &&
      !category &&
      !search &&
      !sortBy &&
      !sort &&
      !limit &&
      !skip &&
      !page &&
      !tags &&
      !minPrice &&
      !maxPrice &&
      !req.query.date
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

    if (req.query.titleOnly === 'true' || req.query.titleOnly === '1') {
      options.searchFields = ['title'];
    }

    // 2. AÑADIR LOS NUEVOS FILTROS
    if (tags) options.tags = Array.isArray(tags) ? tags.map(String) : String(tags);
    if (minPrice && typeof minPrice === 'string') options.minPrice = minPrice;
    if (maxPrice && typeof maxPrice === 'string') options.maxPrice = maxPrice;

    // Normalizar sort: aceptar tanto `sortBy` como el alias `sort` usado por el
    // frontend en algunas rutas. Priorizar `sortBy` cuando exista.
    const sortCandidate =
      (typeof sortBy === 'string' && sortBy) || (typeof sort === 'string' && sort);
    if (sortCandidate && typeof sortCandidate === 'string') {
      const validSorts = Object.values(SortCriteria).map((v) => v.toLowerCase());
      if (validSorts.includes(sortCandidate.toLowerCase()))
        options.sortBy = sortCandidate.toLowerCase();
    }

    // Fecha específica (YYYY-MM-DD)
    if (req.query.date && typeof req.query.date === 'string') {
      const dateStr = req.query.date.trim();
      // validar formato básico YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        options.date = dateStr;
      }
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

    // Añadir campos derivados de fecha para que el frontend pueda mostrar la
    // fecha esperada independientemente de la zona horaria del cliente.
    // publishedDateUTC: DD/MM/YYYY calculada en UTC
    // publishedDateLaPaz: DD/MM/YYYY calculada en 'America/La_Paz' (útil para Bolivia)
    const formatDateInTimezone = (d: any, timeZone: string) => {
      try {
        const date = new Date(d);
        return new Intl.DateTimeFormat('es-ES', {
          timeZone,
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(date);
      } catch (e) {
        return null;
      }
    };

    const dataWithPublished = Array.isArray(result.data)
      ? result.data.map((item: any) => ({
          ...item,
          publishedDateUTC: item.createdAt ? formatDateInTimezone(item.createdAt, 'UTC') : null,
          publishedDateLaPaz: item.createdAt
            ? formatDateInTimezone(item.createdAt, 'America/La_Paz')
            : null,
        }))
      : result.data;

    res.status(200).json({
      success: true,
      count: result.count,
      total: result.count,
      data: dataWithPublished,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ofertas',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getUniqueTags = async (req: Request, res: Response) => {
  try {
    // Devuelve todas las etiquetas únicas presentes en la colección de ofertas
    const tags = await Offer.distinct('tags').exec();
    return res.status(200).json({ success: true, count: tags.length, data: tags });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las etiquetas únicas',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
