import { Request, Response } from 'express';
import {
  getAllOffers,
  getOfferById,
  getOffersByFixerNameRange,
  getOffersByCity,
  getOffersByCategory,
  getOffersFiltered,
  getOffersWithSearch,
} from '../services/jobOfert.service';
import { isValidRange } from '../utils/nameRangeHelper';
import { isValidCity, getAllCities } from '../utils/cityHelper';
import { isValidCategory, getAllCategories } from '../utils/categoryHelper';
import { SortCriteria, DEFAULT_SORT_CONFIG } from '../utils/queryParams.types';

/**
 * GET /api/devmaster/offers
 * Soporta query params: range[], city, category[], search, sortBy
 */
export const getOffers = async (req: Request, res: Response) => {
  try {
    const { range, city, category, search, sortBy } = req.query;

    console.log('📥 Query params recibidos:', { range, city, category, search, sortBy });

    // Si no hay parámetros, retorna todos
    if (!range && !city && !category && !search && !sortBy) {
      const offers = await getAllOffers();
      return res.status(200).json({
        success: true,
        count: offers.length,
        data: offers,
      });
    }

    // Preparar opciones para el servicio
    const options: any = {};

    // Manejar ranges (puede ser string o array)
    if (range) {
      const ranges = Array.isArray(range) ? range : [range as string];
      console.log('Range a procesar:', ranges);
      options.ranges = ranges;
    }

    // Manejar city (single)
    if (city) {
      console.log('City a procesar:', city);
      options.city = city as string;
    }

    // Manejar categories (puede ser string o array)
    if (category) {
      const categories = Array.isArray(category) ? category : [category as string];
      console.log('Categories a procesar:', categories);
      options.categories = categories;
    }

    // Manejar search
    if (search && typeof search === 'string' && search.trim()) {
      console.log('🔎 Search a procesar:', search);
      options.search = search.trim();
    }

    // Manejar sort
    if (sortBy && typeof sortBy === 'string') {
      const validSortValues = Object.values(SortCriteria) as string[];
      if (validSortValues.includes(sortBy.toLowerCase())) {
        console.log('Sort a procesar:', sortBy);
        options.sortBy = sortBy.toLowerCase() as SortCriteria;
      }
    }

    // Llamar al servicio unificado
    const result = await getOffersFiltered(options);

    console.log(`✅ Ofertas retornadas: ${result.count}`);

    res.status(200).json({
      success: true,
      count: result.count,
      total: result.count,
      data: result.data,
    });
  } catch (error) {
    console.error('❌ Error en getOffers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ofertas',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * GET /api/devmaster/offers/:id
 */
export const getOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const offer = await getOfferById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Oferta no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la oferta',
      error,
    });
  }
};

/**
 * GET /api/devmaster/offers/filterByFixerNameRange?range=A-C
 * DEPRECATED: Usar /api/devmaster/offers?range=A-C en su lugar
 */
export const filterOffersByFixerNameRange = async (req: Request, res: Response) => {
  try {
    const { range } = req.query;

    if (!range) {
      return res.status(400).json({
        success: false,
        error: 'Debes especificar un rango',
        validRanges: ['A-C', 'D-F', 'G-I', 'J-L', 'M-Ñ', 'O-Q', 'R-T', 'U-W', 'X-Z'],
      });
    }

    if (!isValidRange(range as string)) {
      return res.status(400).json({
        success: false,
        error: `Rango inválido: ${range}`,
        validRanges: ['A-C', 'D-F', 'G-I', 'J-L', 'M-Ñ', 'O-Q', 'R-T', 'U-W', 'X-Z'],
      });
    }

    const offers = await getOffersByFixerNameRange(range as string);

    res.json({
      success: true,
      range,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al filtrar ofertas por rango',
      details: error,
    });
  }
};

/**
 * GET /api/devmaster/offers/filterByCity?city=La Paz
 * DEPRECATED: Usar /api/devmaster/offers?city=La%20Paz en su lugar
 */
export const filterOffersByCity = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'Debes especificar una ciudad',
        validCities: getAllCities(),
      });
    }

    if (!isValidCity(city as string)) {
      return res.status(400).json({
        success: false,
        error: `Ciudad inválida: ${city}`,
        validCities: getAllCities(),
      });
    }

    const offers = await getOffersByCity(city as string);

    res.json({
      success: true,
      city,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al filtrar ofertas por ciudad',
      details: error,
    });
  }
};

/**
 * GET /api/devmaster/offers/filterByCategory?category=Fontanero
 * DEPRECATED: Usar /api/devmaster/offers?category=Fontanero en su lugar
 */
export const filterOffersByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Debes especificar una categoría',
        validCategories: getAllCategories(),
      });
    }

    if (!isValidCategory(category as string)) {
      return res.status(400).json({
        success: false,
        error: `Categoría inválida: ${category}`,
        validCategories: getAllCategories(),
      });
    }

    const offers = await getOffersByCategory(category as string);

    res.json({
      success: true,
      category,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al filtrar ofertas por categoría',
      details: error,
    });
  }
};

/**
 * GET /api/devmaster/offers/filter?range=A-C&city=La Paz&category=Fontanero
 * DEPRECATED: Usar /api/devmaster/offers?range=A-C&city=La%20Paz&category=Fontanero
 */
export const filterOffers = async (req: Request, res: Response) => {
  try {
    const { range, city, category } = req.query;

    const filters: any = {};
    if (range) filters.ranges = Array.isArray(range) ? range : [range];
    if (city) filters.city = city as string;
    if (category) filters.categories = Array.isArray(category) ? category : [category];

    const result = await getOffersFiltered(filters);

    res.json({
      success: true,
      filters,
      count: result.count,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al filtrar ofertas',
      details: error,
    });
  }
};
