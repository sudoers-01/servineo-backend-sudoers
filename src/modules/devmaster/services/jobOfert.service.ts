// services/offer.service.ts
import { Offer } from '../models/offer.model';
import { searchOffers } from './jobOfert/search.service';
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
};

export const getAllOffers = async () => {
  return await QueryExecutor.findAll(Offer);
};

export const getOffersFiltered = async (options?: OfferFilterOptions) => {
  const filterQuery = filterOffers(options);
  const searchQuery = searchOffers(options?.search);
  const sort = sortOffers(options?.sortBy);
  const { limit, skip } = PaginationCommon.getOptions(options?.limit, options?.skip);

  const finalQuery = FilterCommon.combine(filterQuery, searchQuery);

  return await QueryExecutor.execute(Offer, finalQuery, sort, skip, limit);
};
