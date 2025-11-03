// services/offer.service.ts
import { Offer } from '../models/offer.model';
import { searchOffers } from './jobOfert/search.service';
import { filterOffers } from './jobOfert/filter.service';
import { sortOffers } from './jobOfert/sort.service';
import { FilterCommon } from './common/filter.common';
import { PaginationCommon } from './common/pagination.common';
import { QueryExecutor } from './common/query-executor';
import { SortCriteria } from '../types/sort.types';
// Importar el filtro estándar (actual)
import { filterOffers as standardFilterOffers } from './jobOfert/filter.service';

// Importar el filtro avanzado (tu nuevo archivo)
import {
  filterOffers as advancedFilterOffers,
  FilterOptions,
} from './jobOfert/advancedFilter.service';
export type OfferFilterOptions = {
  ranges?: string[];
  city?: string;
  categories?: string[];
  search?: string;
  sortBy?: string | SortCriteria;
  limit?: number;
  skip?: number;
  // Campos de Búsqueda Avanzada
  tags?: string[] | string;
  minPrice?: string;
  maxPrice?: string;
};

export const getAllOffers = async () => {
  return await QueryExecutor.findAll(Offer);
};

// MODIFICAR getOffersFiltered
export const getOffersFiltered = async (options?: OfferFilterOptions) => {
  // Si no hay opciones, devolver el resultado sin filtros
  if (!options) {
    return await QueryExecutor.execute(Offer, {}, null, 0, 10);
  }

  // 2. LÓGICA DE DECISIÓN: Determinar si es Búsqueda Avanzada
  const isAdvancedSearch = options.tags || options.minPrice || options.maxPrice;

  let filterQuery: any;

  if (isAdvancedSearch) {
    // Opción A: Es avanzada (usa la lógica de Price y Tags)
    filterQuery = advancedFilterOffers(options);
  } else {
    // Opción B: Es estándar (usa solo la lógica de City, Fixer, Category)
    // Usamos standardFilterOffers que tiene la misma firma que filterOffers
    filterQuery = standardFilterOffers(options);
  }

  // 3. COMBINAR CON BÚSQUEDA POR TEXTO (search)
  // Esto se mantiene como estaba, pero usando la 'filterQuery' decidida arriba
  const searchQuery = searchOffers(options?.search);
  const finalQuery = FilterCommon.combine(filterQuery, searchQuery);

  // 4. APLICAR ORDENAMIENTO Y PAGINACIÓN
  const sort = sortOffers(options?.sortBy);
  const { limit, skip } = PaginationCommon.getOptions(options?.limit, options?.skip);

  // 5. EJECUTAR LA CONSULTA FINAL
  return await QueryExecutor.execute(Offer, finalQuery, sort, skip, limit);
};
