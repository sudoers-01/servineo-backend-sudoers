import { Router } from 'express';
import {
  getOffers,
  getOffer,
  filterOffersByFixerNameRange,
  filterOffersByCity,
  filterOffersByCategory,
  filterOffers,
} from '../controller/jobOfert.controller';

const router = Router();

/**
 * ============================================================
 * RUTAS PRINCIPALES (Recomendadas)
 * ============================================================
 */

/**
 * GET /api/devmaster/offers
 *
 * Endpoint unificado que soporta múltiples parámetros:
 * - ?range=De%20(A-C) o ?range=De%20(A-C)&range=De%20(D-F) (múltiples)
 * - ?city=Cochabamba (single)
 * - ?category=Electricista o ?category=Electricista&category=Fontanero (múltiples)
 * - ?search=texto (búsqueda flexible)
 * - ?sortBy=name_asc|name_desc|recent|oldest|rating|contact_asc|contact_desc
 *
 * Ejemplos:
 * /api/devmaster/offers
 * /api/devmaster/offers?search=electricista
 * /api/devmaster/offers?city=Cochabamba
 * /api/devmaster/offers?range=De%20(A-C)&category=Electricista
 * /api/devmaster/offers?search=prueba&sortBy=name_asc
 */
router.get('/offers', getOffers);

/**
 * GET /api/devmaster/offers/:id
 * Obtener una oferta específica por ID
 */
router.get('/:id', getOffer);

/**
 * ============================================================
 * RUTAS LEGACY (DEPRECATED - Mantener para compatibilidad)
 * ============================================================
 */

/**
 * DEPRECATED: Usar GET /api/devmaster/offers?range=...&city=...&category=... en su lugar
 */
router.get('/filter', filterOffers);

/**
 * GET /api/devmaster/offers?range=A-C
 */
router.get('/filterByFixerNameRange', filterOffersByFixerNameRange);

/**
 * DEPRECATED: Usar GET /api/devmaster/offers?city=La%20Paz en su lugar
 */
router.get('/filterByCity', filterOffersByCity);

/**
 * DEPRECATED: Usar GET /api/devmaster/offers?category=Fontanero en su lugar
 */
router.get('/filterByCategory', filterOffersByCategory);

export default router;
