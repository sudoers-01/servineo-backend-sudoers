import { normalizeSearchText } from '../../utils/search.normalizer';

type SearchableOffer = {
  fixerName?: string;
  title?: string;
  description?: string;
  category?: string;
  city?: string;
  [key: string]: unknown;
};

/**
 * Búsqueda inteligente por tokens (divide por comas y espacios)
 * Todos los tokens deben estar presentes en al menos uno de los campos
 */
function matchesAllTokens(offer: SearchableOffer, searchText: string): boolean {
  const tokens = searchText
    .trim()
    .split(/[\s,\-_.]+/)
    .filter((token) => token.length > 0);

  if (tokens.length === 0) return false;

  const regexPatterns = tokens.map((token) => {
    const pattern = normalizeSearchText(token);
    return new RegExp(pattern, 'i');
  });

  const fieldsToSearch = [
    offer.fixerName || '',
    offer.title || '',
    offer.description || '',
    offer.category || '',
    offer.city || '',
  ].join(' ');

  return regexPatterns.every((regex) => regex.test(fieldsToSearch));
}

export function searchOffers<T extends SearchableOffer>(offers: T[], searchText: string): T[] {
  const trimmed = searchText.trim();

  // Si contiene separadores, usa búsqueda inteligente por tokens
  if (/[,\-_.\s]/.test(trimmed)) {
    return offers.filter((o) => matchesAllTokens(o, trimmed));
  }

  // Búsqueda simple por un solo término sin separadores
  const searchPattern = normalizeSearchText(trimmed);
  const regex = new RegExp(searchPattern, 'i');

  return offers.filter((o) => {
    return (
      regex.test(o.fixerName || '') ||
      regex.test(o.title || '') ||
      regex.test(o.description || '') ||
      regex.test(o.category || '') ||
      regex.test(o.city || '')
    );
  });
}
