// services/jobOfert/search-history.service.ts
import { SearchHistory } from '../../models/search-history.model';
import { normalizeSearchText } from '../../utils/search.normalizer';
import { validateAndCleanSearchTerm, filterSpecialCharacters  } from '../../utils/searchTermValidator';

/**
 * Guarda una búsqueda en el historial
 * Evita duplicados y actualiza la posición si ya existe
 */
export async function saveSearchToHistory(
  searchTerm: string,
  sessionId?: string,
  userId?: string
): Promise<any> {
  try {
    // Validar y limpiar el término
    const cleanedTerm = validateAndCleanSearchTerm(searchTerm);
    
    if (!cleanedTerm) {
      return null; // Término inválido
    }

    const filteredTerm = filterSpecialCharacters(cleanedTerm);
    
    if (!filteredTerm) {
      return null; // Solo tenía caracteres especiales
    }
    const normalizedTerm = normalizeSearchText(cleanedTerm);

    const identifier = userId || sessionId;
    if (!identifier) {
      throw new Error('Se requiere sessionId o userId');
    }

    // Buscar si ya existe el término (no archivado)
    const query = userId 
      ? { userId, normalizedTerm, isArchived: false }
      : { sessionId, normalizedTerm, isArchived: false };

    const existing = await SearchHistory.findOne(query);

    if (existing) {
      existing.searchedAt = new Date();
      existing.searchTerm = filteredTerm;
      return await existing.save();
    }

    // Crear nuevo registro
    const newSearch = new SearchHistory({
      sessionId: userId ? undefined : sessionId,
      userId,
      searchTerm: filteredTerm,
      normalizedTerm,
      searchedAt: new Date(),
      isArchived: false,
    });

    return await newSearch.save();
  } catch (error) {
    console.error('Error saving search to history:', error);
    throw error;
  }
}

/**
 * Obtiene el historial de búsquedas de un usuario/sesión
 * Limitado a los últimos 5 registros, ordenados por más reciente
 */
export async function getSearchHistory(
  sessionId?: string,
  userId?: string,
  limit: number = 5
): Promise<any[]> {
  try {
    const identifier = userId || sessionId;
    if (!identifier) {
      return [];
    }

    const query = userId
      ? { userId, isArchived: false }
      : { sessionId, isArchived: false };

    const history = await SearchHistory.find(query)
      .sort({ searchedAt: -1 })
      .limit(limit)
      .select('searchTerm searchedAt')
      .lean();

    return history;
  } catch (error) {
    console.error('Error getting search history:', error);
    throw error;
  }
}