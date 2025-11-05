import { Request, Response } from 'express';
import { getAllOffers, getOffersFiltered } from '../services/jobOfert.service';
import { SortCriteria } from '../types/sort.types';
import { 
  saveSearchToHistory, 
  filterSearchHistory, 
  deleteHistoryItem, 
  reenqueueOldSearches, 
  clearAllHistory,
  getSearchHistory 
} from '../services/jobOfert/search-history.service';
import { filterSuggestions } from '../services/jobOfert/search-suggestions.service';

export const getOffers = async (req: Request, res: Response) => {
  try {
  const { range, city, category, search, sortBy, limit, skip, page, sessionId, userId, action, searchTerm, record } = req.query;

    // ==================== ACCIONES DE HISTORIAL ====================
    if (action && typeof action === 'string') {
      const act = action.toString();

      const sid = typeof sessionId === 'string' ? sessionId : undefined;
      const uid = typeof userId === 'string' ? userId : undefined;

      if (!sid && !uid) {
        return res.status(400).json({
          success: false,
          message: 'Para la acción requerida debe enviarse sessionId o userId',
        });
      }

      // ===== DELETE HISTORY =====
if (act === 'deleteHistory') {
  const term = (typeof searchTerm === 'string' && searchTerm.trim()) 
    ? searchTerm.trim()
    : (typeof search === 'string' && search.trim()) 
    ? search.trim()
    : undefined;

  if (!term) {
    return res.status(400).json({
      success: false,
      message: 'Parámetro searchTerm es requerido para deleteHistory',
    });
  }

  // Eliminar el item
  const deleted = await deleteHistoryItem(term, sid, uid);

  // CAMBIO: Siempre devolver 200 aunque no encuentre el documento
  // porque puede que ya esté archivado
  
  // Obtener historial actualizado después de re-encolar
  const updatedHistory = await getSearchHistory(sid, uid, 5);

  return res.status(200).json({
    success: true,  // <-- Siempre true si no hay error de servidor
    action: 'deleteHistory',
    deleted,
    searchHistory: updatedHistory,
  });
}
      // ===== REENQUEUE =====
      if (act === 'reenqueue') {
        const requeued = await reenqueueOldSearches(sid, uid);
        const updatedHistory = await getSearchHistory(sid, uid, 5);
        
        return res.status(200).json({
          success: true,
          action: 'reenqueue',
          requeued,
          searchHistory: updatedHistory,
        });
      }

      // ===== CLEAR ALL HISTORY =====
      if (act === 'clearAllHistory') {
        const cleared = await clearAllHistory(sid, uid);
        
        return res.status(200).json({
          success: true,
          action: 'clearAllHistory',
          cleared,
          searchHistory: [], // Historial vacío después de limpiar
        });
      }

      // ===== GET HISTORY =====
      if (act === 'getHistory') {
        const term = typeof search === 'string' ? search.trim() : '';
        
        const historyItems = await filterSearchHistory(term, sid, uid, 5);
        
        return res.status(200).json({
          success: true,
          action: 'getHistory',
          searchHistory: historyItems,
        });
      }

      // Acción no soportada
      return res.status(400).json({
        success: false,
        message: `Acción no soportada: ${act}`,
      });
    }

    // ==================== BÚSQUEDA DE OFERTAS ====================

    // Si no hay query params, retorna todas
    if (!range && !city && !category && !search && !sortBy && !limit && !skip && !page) {
      const offers = await getAllOffers();
      return res.status(200).json({
        success: true,
        count: offers.length,
        total: offers.length,
        data: offers,
      });
    }

    // Preparar opciones para el service
    const options: any = {};

    if (range) options.ranges = Array.isArray(range) ? range.map(String) : [String(range)];
    if (city && typeof city === 'string') options.city = city;
    if (category)
      options.categories = Array.isArray(category) ? category.map(String) : [String(category)];
    if (search && typeof search === 'string') options.search = search.trim();

    if (sortBy && typeof sortBy === 'string') {
      const validSorts = Object.values(SortCriteria).map((v) => v.toLowerCase());
      if (validSorts.includes(sortBy.toLowerCase())) options.sortBy = sortBy.toLowerCase();
    }

    // Paginación
    const itemsPerPage = limit && !isNaN(Number(limit)) ? Number(limit) : 10;
    options.limit = itemsPerPage;

    if (page && !isNaN(Number(page))) {
      options.skip = (Number(page) - 1) * itemsPerPage;
    } else if (skip && !isNaN(Number(skip))) {
      options.skip = Number(skip);
    } else {
      options.skip = 0;
    }

    // Llamar al service unificado
    const result = await getOffersFiltered(options);

    const response: any = {
      success: true,
      count: result.count,
      total: result.count,
      data: result.data,
    };

    // Guardar búsqueda en historial si hay término de búsqueda
    if (search && typeof search === 'string' && search.trim()) {
      const recordFlag = typeof record === 'string' ? record : undefined;
      let sid = typeof sessionId === 'string' ? sessionId : undefined;
      const uid = typeof userId === 'string' ? userId : undefined;
      const searchTermTrimmed = search.trim();

      // Solo generar sessionId y guardar historial si record !== 'false'
      if (recordFlag !== 'false') {
        // Si no hay ni sessionId ni userId, generar uno
        if (!sid && !uid) {
          sid = `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
          response.sessionId = sid;
        }
        
        // Guardar búsqueda en historial (asíncrono, no esperar)
        saveSearchToHistory(searchTermTrimmed, sid, uid).catch((error) => {
          console.error('Error saving search to history:', error);
        });

        // Obtener historial filtrado
        try {
          const searchHistory = await filterSearchHistory(searchTermTrimmed, sid, uid, 5);
          if (searchHistory.length > 0) {
            response.searchHistory = searchHistory;
          }
        } catch (error) {
          console.error('Error filtering search history:', error);
        }
      }

      // Obtener sugerencias (siempre)
      try {
        const suggestions = await filterSuggestions(searchTermTrimmed, 5, uid, sid);
        if (suggestions && suggestions.length > 0) {
          response.suggestions = suggestions;
        }
      } catch (error) {
        console.error('Error filtering suggestions:', error);
      }
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error en getOffers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ofertas',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};