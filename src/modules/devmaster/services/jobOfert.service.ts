import { Offer } from '../models/offer.model';
import { searchOffers } from './core/search.service';
import { filterOffers } from './core/filter.service';
import { sortOffers } from './core/sort.service';
import { paginateOffers } from './core/pagination.service';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qAll: any = Offer.find();
  return await qAll.sort({ createdAt: -1 }).lean().exec();
};

export const getOfferById = async (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qById: any = Offer.findById(id);
  return await qById.lean().exec();
};

export const getOffersFiltered = async (options?: OfferFilterOptions) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qAll2: any = Offer.find();
  const allOffers = await qAll2.lean().exec();

  if (allOffers.length === 0) {
    return { count: 0, data: [] };
  }

  let filteredOffers = [...allOffers];

  // Filtrar
  filteredOffers = filterOffers(filteredOffers, {
    ranges: options?.ranges,
    city: options?.city,
    categories: options?.categories,
  });

  // Buscar
  if (options?.search && options.search.trim()) {
    filteredOffers = searchOffers(filteredOffers, options.search);
  }

  // Ordenar
  filteredOffers = sortOffers(filteredOffers, options?.sortBy);

  // Paginar
  const limit = options?.limit || 10;
  const skip = options?.skip || 0;
  const paginatedOffers = paginateOffers(filteredOffers, { limit, skip });

  return {
    count: filteredOffers.length,
    data: paginatedOffers,
  };
};
