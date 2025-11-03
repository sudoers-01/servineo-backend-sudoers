// services/offer.service.ts
import { Offer } from '../models/offer.model';
import { searchOffers, searchOffersExactFields } from './jobOfert/search.service';
import { filterOffers } from './jobOfert/filter.service';
import { sortOffers } from './jobOfert/sort.service';
import { FilterCommon } from './common/filter.common';
import { PaginationCommon } from './common/pagination.common';
import { QueryExecutor } from './common/query-executor';
import { SortCriteria } from '../types/sort.types';

export type OfferFilterOptions = {
  ranges?: string[];
  city?: string;
  categories?: string[];
  search?: string;
  sortBy?: string | SortCriteria;
  limit?: number;
  skip?: number;

  // NUEVO (opcional pero recomendable)
  searchMode?: 'exact' | 'smart';
  searchFields?: string[]; // cuando se quiere limitar campos en la búsqueda
};

export const getAllOffers = async () => {
  return await QueryExecutor.findAll(Offer);
};

export const getOffersFiltered = async (options?: OfferFilterOptions) => {
  const filterQuery = filterOffers(options);
  let searchQuery: any = {};

  if (options?.search) {
    if (options.searchMode === 'exact') {
      // si se pasaron campos explícitos los usamos, sino por defecto title+description
      const fields =
        options.searchFields && options.searchFields.length > 0
          ? options.searchFields
          : ['title', 'description'];
      // usa la función wrapper que añadimos y pasa los campos
      searchQuery = searchOffersExactFields(options.search, fields);
    } else {
      // comportamiento existente (smart search)
      searchQuery = searchOffers(options.search);
    }
  } else {
    searchQuery = {};
  }

  const sort = sortOffers(options?.sortBy);
  const { limit, skip } = PaginationCommon.getOptions(options?.limit, options?.skip);

  const finalQuery = FilterCommon.combine(filterQuery, searchQuery);

  return await QueryExecutor.execute(Offer, finalQuery, sort, skip, limit);
};
