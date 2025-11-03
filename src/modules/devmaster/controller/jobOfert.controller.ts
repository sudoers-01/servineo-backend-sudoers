import { Request, Response } from 'express';
import { getAllOffers, getOffersFiltered } from '../services/jobOfert.service';
import { SortCriteria } from '../types/sort.types';
import { saveSearchToHistory, filterSearchHistory, deleteHistoryItem, reenqueueOldSearches } from '../services/jobOfert/search-history.service';
import { filterSuggestions } from '../services/jobOfert/search-suggestions.service';


export const getOffers = async (req: Request, res: Response) => {
  try {
    const { range, city, category, search, sortBy, limit, skip, page, sessionId, userId, action, searchTerm } = req.query;

    if (action && typeof action === 'string') {
      const act = action.toString();

      // identificar quién hace la acción
      const sid = typeof sessionId === 'string' ? sessionId : undefined;
      const uid = typeof userId === 'string' ? userId : undefined;

      // Para estas acciones exigimos sessionId o userId (no generamos anon id)
      if (!sid && !uid) {
        return res.status(400).json({
          success: false,
          message: 'Para la acción requerida debe enviarse sessionId o userId',
        });
      }

      if (act === 'deleteHistory') {
        // searchTerm puede venir en query ?searchTerm=... o en search (si lo usas)
        const term = (typeof searchTerm === 'string' && searchTerm.trim()) ? searchTerm.trim()
          : (typeof search === 'string' && search.trim()) ? search.trim()
          : undefined;

        if (!term) {
          return res.status(400).json({
            success: false,
            message: 'Parámetro searchTerm es requerido para deleteHistory',
          });
        }

        // Llamar al servicio que archiva el ítem
        const deleted = await deleteHistoryItem(term, sid, uid);

        // Obtener qué se reactivó (el service deleteHistoryItem internamente llama reenqueue,
        // pero para devolver los items reactivados llamamos explícitamente a reenqueueOldSearches)
        const requeued = await reenqueueOldSearches(sid, uid);

        return res.status(200).json({
          success: true,
          action: 'deleteHistory',
          deleted,
          requeued, // array de items reactivados (puede ser [])
        });
      }

      if (act === 'reenqueue') {
        // Forzar re-enqueue: reactivar archivados recientes hasta llenar 5
        const requeued = await reenqueueOldSearches(sid, uid);
        return res.status(200).json({
        success: true,
        action: 'reenqueue',
        requeued,
      });
    }
      // Acción no soportada
      return res.status(400).json({
        success: false,
        message: `Acción no soportada: ${act}`,
      });
    }

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

    if (search && typeof search === 'string' && search.trim()) {
      let sid = typeof sessionId === 'string' ? sessionId : undefined;
      const uid = typeof userId === 'string' ? userId : undefined;
      const searchTermTrimmed = search.trim();

      // Si no hay ni sessionId ni userId, generamos uno en el servidor
      // y lo devolvemos en la respuesta JSON para que el cliente lo persista.
      if (!sid && !uid) {
        sid = `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        // Añadir sessionId generado a la respuesta para que el frontend lo guarde
        response.sessionId = sid;
      }
      
      // Guardar búsqueda en historial
      saveSearchToHistory(searchTermTrimmed, sid, uid).catch((error) => {
        console.error('Error saving search to history:', error);
      });

      // Obtener historial filtrado basado en el término de búsqueda
      try {
        const searchHistory = await filterSearchHistory(searchTermTrimmed, sid, uid, 5);
        if (searchHistory.length > 0) {
          response.searchHistory = searchHistory;
        }
      } catch (error) {
        console.error('Error filtering search history:', error);
      }

      try {
        const suggestions = await filterSuggestions(searchTermTrimmed, 5);
        if (suggestions.length > 0) {
          response.suggestions = suggestions;
        }
      } catch (error) {
        console.error('Error filtering suggestions:', error);
      }
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ofertas',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
