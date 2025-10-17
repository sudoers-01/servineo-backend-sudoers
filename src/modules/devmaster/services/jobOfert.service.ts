import { Offer } from '../models/offer.model';
import { getRangeRegex } from '../utils/nameRangeHelper';
import { validateAndNormalizeCity } from '../utils/cityHelper';
import { validateAndNormalizeCategory } from '../utils/categoryHelper';
import { normalizeSearchText } from '../utils/search.normalizer';
import { SortCriteria, DEFAULT_SORT_CONFIG } from '../utils/queryParams.types';

function normalizeNumber(num?: string | number | null): number {
  if (!num) return 0;
  const parsed = Number(String(num).replace(/\D/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export const getAllOffers = async () => {
  return await Offer.find().sort({ createdAt: -1 }).lean().exec();
};

export const getOfferById = async (id: string) => {
  return await Offer.findById(id).lean().exec();
};

/**
 * Filtrar ofertas por rango de nombre de fixer
 */
export const getOffersByFixerNameRange = async (range: string) => {
  const regex = getRangeRegex(range);

  if (!regex) {
    throw new Error(`Rango inválido: ${range}`);
  }

  return await Offer.find({
    fixerName: regex,
  })
    .sort({ fixerName: 1 })
    .lean()
    .exec();
};

/**
 * Filtrar ofertas por ciudad
 */
export const getOffersByCity = async (city: string) => {
  const normalizedCity = validateAndNormalizeCity(city);

  return await Offer.find({
    city: normalizedCity,
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
};

/**
 * Filtrar ofertas por categoría
 */
export const getOffersByCategory = async (category: string) => {
  const normalizedCategory = validateAndNormalizeCategory(category);

  return await Offer.find({
    category: normalizedCategory,
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
};

/**
 * Filtrar ofertas con múltiples criterios
 */
export const getOffersFiltered = async (options?: {
  ranges?: string[];
  city?: string;
  categories?: string[];
  search?: string;
  sortBy?: SortCriteria;
}) => {
  console.log('\n=== INICIO FILTRADO ===');
  console.log('Opciones recibidas:', JSON.stringify(options, null, 2));

  // Paso 1: Obtener TODAS las ofertas de la BD
  const allOffers = await Offer.find().lean().exec();
  console.log(`Total de ofertas en BD: ${allOffers.length}`);

  if (allOffers.length === 0) {
    console.log('⚠️ No hay ofertas en la base de datos');
    return { count: 0, data: [] };
  }

  // Mostrar muestra de datos en BD
  console.log('\nMuestra de ofertas en BD:');
  allOffers.slice(0, 3).forEach((o: any) => {
    console.log(`  - Fixer: ${o.fixerName}, Category: ${o.category}, City: ${o.city}`);
  });

  // Paso 2: Aplicar filtros EN MEMORIA (más fácil de debugear)
  let filteredOffers = [...allOffers];

  // Filtro por rango
  if (options?.ranges && options.ranges.length > 0) {
    console.log(`\n📍 Aplicando filtro de rangos: ${options.ranges.join(', ')}`);
    const beforeCount = filteredOffers.length;

    // Compilar todas las regexes
    const regexes = options.ranges
      .map((range) => {
        console.log(`  Procesando rango: "${range}"`);
        const regex = getRangeRegex(range);
        if (regex) {
          console.log(`    Regex creada: ${regex}`);
        } else {
          console.log(`    ❌ No se pudo crear regex para: "${range}"`);
        }
        return regex;
      })
      .filter((r) => r !== null) as RegExp[];

    if (regexes.length === 0) {
      console.log(`  ⚠️ No hay rangos válidos`);
    } else {
      filteredOffers = filteredOffers.filter((offer: any) => {
        const name = (offer.fixerName || '').trim();
        const matches = regexes.some((regex) => regex.test(name));

        if (matches) {
          console.log(`    ✅ "${name}" coincide con uno de los rangos`);
        }

        return matches;
      });
    }

    console.log(`  Resultado: ${beforeCount} → ${filteredOffers.length}`);

    if (filteredOffers.length === 0) {
      console.log('  ⚠️ Primeras letras en BD:');
      allOffers.slice(0, 10).forEach((o: any) => {
        const firstLetter = (o.fixerName || '')[0];
        console.log(`    - ${o.fixerName} (empieza con: ${firstLetter})`);
      });
    }
  }

  // Filtro por ciudad
  if (options?.city) {
    console.log(`\n🏙️  Aplicando filtro de ciudad: ${options.city}`);
    const normalizedCity = validateAndNormalizeCity(options.city);
    console.log(`  Ciudad normalizada: ${normalizedCity}`);
    const beforeCount = filteredOffers.length;

    filteredOffers = filteredOffers.filter((offer: any) => offer.city === normalizedCity);

    console.log(`  Resultado: ${beforeCount} → ${filteredOffers.length}`);

    if (filteredOffers.length === 0) {
      console.log(
        '  ⚠️ Ciudades disponibles en BD:',
        [...new Set(allOffers.map((o: any) => o.city))].join(', '),
      );
    }
  }

  // Filtro por categoría
  if (options?.categories && options.categories.length > 0) {
    console.log(`\n💼 Aplicando filtro de categorías: ${options.categories.join(', ')}`);
    const beforeCount = filteredOffers.length;

    const normalizedCategories = options.categories
      .map((c) => validateAndNormalizeCategory(c))
      .filter((c) => c !== null);

    console.log(`  Categorías normalizadas: ${normalizedCategories.join(', ')}`);

    filteredOffers = filteredOffers.filter((offer: any) =>
      normalizedCategories.includes(offer.category),
    );

    console.log(`  Resultado: ${beforeCount} → ${filteredOffers.length}`);

    if (filteredOffers.length === 0) {
      console.log(
        '  ⚠️ Categorías disponibles en BD:',
        [...new Set(allOffers.map((o: any) => o.category))].join(', '),
      );
    }
  }

  // Filtro de búsqueda
  if (options?.search && options.search.trim()) {
    const searchText = options.search.trim().toLowerCase();
    console.log(`\n🔎 Aplicando búsqueda: "${searchText}"`);
    const beforeCount = filteredOffers.length;

    filteredOffers = filteredOffers.filter((o: any) => {
      const fixerNameNorm = (o.fixerName || '').toLowerCase();
      const titleNorm = (o.title || '').toLowerCase();
      const descriptionNorm = (o.description || '').toLowerCase();
      const categoryNorm = (o.category || '').toLowerCase();
      const cityNorm = (o.city || '').toLowerCase();

      const matches =
        fixerNameNorm.includes(searchText) ||
        titleNorm.includes(searchText) ||
        descriptionNorm.includes(searchText) ||
        categoryNorm.includes(searchText) ||
        cityNorm.includes(searchText);

      if (matches) {
        console.log(`  ✅ Match: ${o.fixerName} (${o.title})`);
      }

      return matches;
    });

    console.log(`  Resultado: ${beforeCount} → ${filteredOffers.length}`);
  }

  // Ordenamiento
  const sortBy = options?.sortBy || DEFAULT_SORT_CONFIG.sortBy;
  console.log(`\n📊 Aplicando ordenamiento: ${sortBy}`);

  const combinedOffers = filteredOffers.map((o: any) => ({
    ...o,
    fixerName: o.fixerName || '',
    createdAt: o.createdAt ? new Date(o.createdAt) : new Date(0),
    contactPhone: o.contactPhone || '',
    rating: o.rating ?? 0,
  }));

  combinedOffers.sort((a: any, b: any) => {
    switch (sortBy) {
      case SortCriteria.DATE_RECENT:
        return b.createdAt.getTime() - a.createdAt.getTime();
      case SortCriteria.DATE_OLDEST:
        return a.createdAt.getTime() - b.createdAt.getTime();
      case SortCriteria.NAME_ASC:
        return a.fixerName.localeCompare(b.fixerName, 'es');
      case SortCriteria.NAME_DESC:
        return b.fixerName.localeCompare(a.fixerName, 'es');
      case SortCriteria.RATING:
        return b.rating - a.rating;
      case SortCriteria.CONTACT_ASC:
        return normalizeNumber(a.contactPhone) - normalizeNumber(b.contactPhone);
      case SortCriteria.CONTACT_DESC:
        return normalizeNumber(b.contactPhone) - normalizeNumber(a.contactPhone);
      default:
        return 0;
    }
  });

  console.log(`\n✅ RESULTADO FINAL: ${combinedOffers.length} ofertas`);
  console.log('=== FIN FILTRADO ===\n');

  return { count: combinedOffers.length, data: combinedOffers };
};

/**
 * Búsqueda de servicios por nombre (legacy)
 */
export const getOffersWithSearch = async (search: string) => {
  if (!search.trim()) {
    return await getAllOffers();
  }

  const searchPattern = normalizeSearchText(search);
  const offers = await Offer.find({
    $or: [
      { fixerName: { $regex: searchPattern, $options: 'i' } },
      { title: { $regex: searchPattern, $options: 'i' } },
      { description: { $regex: searchPattern, $options: 'i' } },
      { category: { $regex: searchPattern, $options: 'i' } },
    ],
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return offers;
};
