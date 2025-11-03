// src/services/jobOfert/search-suggestions.service.ts
import { SearchHistory } from '../../models/search-history.model';
import { normalizeForHistory } from '../../utils/search.normalizer';

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Filtra sugerencias basadas en búsquedas populares de TODOS los usuarios
 * Solo muestra términos completos y profesionales (mínimo 3 caracteres)
 */
export async function filterSuggestions(
  searchTerm: string,
  limit: number = 5
): Promise<any[]> {
  try {
    const minLength = 3;

    // Sin término o con menos de 3 caracteres: no mostrar nada
    if (!searchTerm || !searchTerm.trim() || searchTerm.trim().length < minLength) {
      return [];
    }

    const normalizedInput = normalizeForHistory(searchTerm.trim());

    const suggestions = await SearchHistory.aggregate([
      {
        $match: {
          isArchived: false,
          normalizedTerm: { $regex: `^${escapeRegex(normalizedInput)}`, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$normalizedTerm',
          searchTerm: { $first: '$searchTerm' },
          count: { $sum: 1 },
          lastSearched: { $max: '$searchedAt' }
        }
      },
      { $sort: { count: -1, lastSearched: -1 } },
      {
        $project: {
          _id: 0,
          term: '$searchTerm',
          count: 1
        }
      }
    ]);

    const filtered = suggestions.filter((s: any) =>
      s.term &&
      s.term.length >= minLength &&
      s.count > 1 &&
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(s.term) // opcional: solo letras válidas
    );

    // Limitar cantidad de resultados
    return filtered.slice(0, limit);

  } catch (error) {
    console.error('Error filtering suggestions:', error);
    throw error;
  }
}

/**
 * Obtiene las sugerencias más populares (top searches)
 */
export async function getTopSuggestions(limit: number = 10): Promise<any[]> {
  try {
    const minLength = 3;
    
    const topSearches = await SearchHistory.aggregate([
      { $match: { isArchived: false } },
      { 
        $group: {
          _id: '$normalizedTerm',
          searchTerm: { $first: '$searchTerm' },
          count: { $sum: 1 },
          lastSearched: { $max: '$searchedAt' }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          term: '$searchTerm',
          count: 1
        }
      }
    ]);

    // Convertir a array y filtrar
    const results = Array.from(topSearches);
    const filtered = results.filter((s: any) => s.term && s.term.length >= minLength);

    return filtered.slice(0, limit).map((s: any) => ({
      term: s.term,
      count: s.count
    }));
  } catch (error) {
    console.error('Error getting top suggestions:', error);
    throw error;
  }
}