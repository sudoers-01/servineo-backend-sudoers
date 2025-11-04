// services/jobOfert/search-history.service.ts
import { SearchHistory } from '../../models/search-history.model';
import { normalizeForHistory } from '../../utils/search.normalizer';
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
    const normalizedTerm = normalizeForHistory(cleanedTerm);

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
      .select('searchTerm searchedAt isArchived')
      .lean();

    return history;
  } catch (error) {
    console.error('Error getting search history:', error);
    throw error;
  }
}

export async function filterSearchHistory(
  searchTerm: string,
  sessionId?: string,
  userId?: string,
  limit: number = 5
): Promise<any[]> {
  try {
    if (!searchTerm || !searchTerm.trim()) {
      return getSearchHistory(sessionId, userId, limit);
    }

    const identifier = userId || sessionId;
    if (!identifier) {
      return [];
    }

    const normalizedInput = normalizeForHistory(searchTerm.trim());
    
    const query = userId
      ? { userId, isArchived: false }
      : { sessionId, isArchived: false };

    const history = await SearchHistory.find(query)
      .sort({ searchedAt: -1 })
      .select('searchTerm normalizedTerm searchedAt isArchived')
      .lean();

    const filtered = history.filter((item: any) =>
      item.normalizedTerm.includes(normalizedInput)
    );

    return filtered.slice(0, limit).map((item: any) => ({
      searchTerm: item.searchTerm,
      searchedAt: item.searchedAt,
    }));
  } catch (error) {
    console.error('Error filtering search history:', error);
    throw error;
  }
}

/**
 * Elimina (archiva) un ítem específico del historial
 * Automáticamente re-encola búsquedas antiguas si quedan menos de 5
 */
export async function deleteHistoryItem(
  searchTerm: string,
  sessionId?: string,
  userId?: string
): Promise<boolean> {
  try {
    const identifier = userId || sessionId;
    if (!identifier) {
      return false;
    }

    if (!searchTerm || !searchTerm.trim()) {
      return false;
    }

    const normalizedTerm = normalizeForHistory(searchTerm.trim());

    const query = userId
      ? { userId, normalizedTerm, isArchived: false }
      : { sessionId, normalizedTerm, isArchived: false };

    const updated = await SearchHistory.findOneAndUpdate(
      query,
      { isArchived: true },
      { new: true }
    );

    if (updated) {
      await reenqueueOldSearches(sessionId, userId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting history item:', error);
    throw error;
  }
}

/**
 * Recupera búsquedas antiguas cuando se archiva un ítem
 * Mantiene el límite de 5 ítems activos
 */
export async function reenqueueOldSearches(
  sessionId?: string,
  userId?: string
): Promise<any[]> {
  try {
    const identifier = userId || sessionId;
    if (!identifier) {
      return [];
    }

    // Contar cuántos ítems activos hay
    const activeQuery = userId
      ? { userId, isArchived: false }
      : { sessionId, isArchived: false };

    const activeCount = await SearchHistory.countDocuments(activeQuery);

    // Si hay menos de 5, recuperar archivados más recientes
    if (activeCount < 5) {
      const needed = 5 - activeCount;
      const archivedQuery = userId
        ? { userId, isArchived: true }
        : { sessionId, isArchived: true };

      const toRecover = await SearchHistory.find(archivedQuery)
        .sort({ searchedAt: -1 })
        .limit(needed);

      // Desmarcar como archivados
      for (const item of toRecover) {
        item.isArchived = false;
        await item.save();
      }

      return toRecover;
    }

    return [];
  } catch (error) {
    console.error('Error reenqueuing old searches:', error);
    throw error;
  }
}

/**
 * Archiva TODO el historial de un usuario/sesión
 * No elimina de la BD, solo marca como archivado
 */
export async function clearAllHistory(
  sessionId?: string,
  userId?: string
): Promise<number> {
  try {
    const identifier = userId || sessionId;
    if (!identifier) {
      return 0;
    }

    const query = userId
      ? { userId, isArchived: false }
      : { sessionId, isArchived: false };

    const result = await SearchHistory.updateMany(query, { 
      isArchived: true 
    });

    return result.modifiedCount;
  } catch (error) {
    console.error('Error clearing all history:', error);
    throw error;
  }
}