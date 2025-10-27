import { search } from '../common/search.common';

type SearchableOffer = {
  fixerName?: string;
  title?: string;
  description?: string;
  category?: string;
  city?: string;
  [key: string]: unknown;
};

export function searchOffers<T extends SearchableOffer>(offers: T[], searchText: string): T[] {
  return search(offers, searchText, ['fixerName', 'title', 'description', 'category', 'city']);
}
