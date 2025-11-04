// services/offer.service.ts
import { Offer } from '../models/offer.model';
import {
  searchOffers,
  searchOffersExactFields,
  searchOffersInFields,
} from './jobOfert/search.service';
import { sortOffers } from './jobOfert/sort.service';
import { FilterCommon } from './common/filter.common';
import { PaginationCommon } from './common/pagination.common';
import { QueryExecutor } from './common/query-executor';
import { SortCriteria } from '../types/sort.types';
import { filterOffers as standardFilterOffers } from './jobOfert/filter.service';
import { filterOffers as advancedFilterOffers } from './jobOfert/advancedFilter.service';

export type OfferFilterOptions = {
  ranges?: string[];
  city?: string;
  categories?: string[];
  search?: string;
  sortBy?: string | SortCriteria;
  limit?: number;
  skip?: number;
  tags?: string[] | string;
  minPrice?: string;
  maxPrice?: string;

  searchMode?: 'exact' | 'smart';
  searchFields?: string[];
};

export const getAllOffers = async () => {
  return await QueryExecutor.findAll(Offer);
};

// MODIFICAR getOffersFiltered
export const getOffersFiltered = async (options?: OfferFilterOptions) => {
  // Si no hay opciones, devolver el resultado sin filtros
  if (!options) {
    return await QueryExecutor.execute(Offer, {}, null, 0, 10);
  } // 1. LÓGICA DE DECISIÓN: Determinar si es Búsqueda Avanzada

  const isAdvancedSearch = options.tags || options.minPrice || options.maxPrice;

  let filterQuery: any;

  if (isAdvancedSearch) {
    // Opción A: Es avanzada (usa la lógica de Price y Tags)
    filterQuery = advancedFilterOffers(options);
  } else {
    // Opción B: Es estándar (usa solo la lógica de City, Fixer, Category)
    filterQuery = standardFilterOffers(options);
  } // 2. LÓGICA DE BÚSQUEDA POR TEXTO (SEARCH) - ¡UNIFICADA Y CORREGIDA!

  let searchQuery: any = {};

  if (options.search) {
    if (options.searchMode === 'exact') {
      // Lógica para búsqueda exacta (normalizada) cuando se pide exact
      const fields =
        options.searchFields && options.searchFields.length > 0
          ? options.searchFields
          : ['title', 'description'];
      searchQuery = searchOffersExactFields(options.search, fields);
    } else if (options.searchFields && options.searchFields.length > 0) {
      // Si el caller indicó campos concretos (por ejemplo title-only),
      // usamos la variante smart limitada a esos campos.
      searchQuery = searchOffersInFields(options.search, options.searchFields);
    } else {
      // Comportamiento por defecto (smart search sobre todos los campos)
      searchQuery = searchOffers(options.search);
    }
  } // 3. COMBINAR TODOS LOS FILTROS
  // Combina la Query de Filtros (filterQuery) y la Query de Búsqueda por Texto (searchQuery)
  const finalQuery = FilterCommon.combine(filterQuery, searchQuery); // 4. APLICAR ORDENAMIENTO Y PAGINACIÓN

  const sort = sortOffers(options?.sortBy);
  const { limit, skip } = PaginationCommon.getOptions(options?.limit, options?.skip); // 5. EJECUTAR LA CONSULTA FINAL

  return await QueryExecutor.execute(Offer, finalQuery, sort, skip, limit);
};
