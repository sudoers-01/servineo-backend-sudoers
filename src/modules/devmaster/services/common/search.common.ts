// services/common/search.service.ts
import { generatePluralVariations } from '../../utils/search.normalizer';

export class SearchService {
  /**
   * Búsqueda básica con regex simple
   */
  static build(searchText: string | undefined, fields: string[]): any {
    if (!searchText?.trim()) return {};

    const regex = new RegExp(searchText.trim(), 'i');
    return {
      $or: fields.map((field) => ({ [field]: regex })),
    };
  }

  /**
   * Búsqueda con normalizador (para acentos, etc) y variaciones de plural/singular
   */
  static buildWithNormalizer(
    searchText: string | undefined,
    fields: string[],
    normalizer: (text: string) => string,
  ): any {
    if (!searchText?.trim()) return {};

    const normalized = normalizer(searchText.trim());

    // Generar variaciones de plural/singular
    const variations = generatePluralVariations(searchText.trim());

    // Normalizar cada variación
    const normalizedVariations = variations.map((v) => normalizer(v));

    // Crear un regex que coincida con cualquiera de las variaciones
    const pattern = normalizedVariations.join('|');
    const regex = new RegExp(pattern, 'i');

    return {
      $or: fields.map((field) => ({ [field]: regex })),
    };
  }

  static buildTokenSearch(
    searchText: string | undefined,
    fields: string[],
    normalizer?: (text: string) => string,
  ): any {
    if (!searchText?.trim()) return {};

    const tokens = searchText
      .trim()
      .split(/[\s,\-_.]+/)
      .filter((token) => token.length > 0);

    if (tokens.length === 0) return {};

    // Si solo hay un token, usar búsqueda simple con variaciones
    if (tokens.length === 1) {
      const variations = generatePluralVariations(tokens[0]);
      const normalizedVariations = variations.map((v) => (normalizer ? normalizer(v) : v));
      const pattern = normalizedVariations.join('|');
      const regex = new RegExp(pattern, 'i');
      return {
        $or: fields.map((field) => ({ [field]: new RegExp(bounded, 'i') })),
      };
    }

    // Múltiples tokens: cada campo debe contener TODOS los tokens (con sus variaciones)
    const tokenRegexes = tokens.map((token) => {
      const variations = generatePluralVariations(token);
      const normalizedVariations = variations.map((v) => (normalizer ? normalizer(v) : v));
      const pattern = normalizedVariations.join('|');
      return new RegExp(pattern, 'i');
    });

    return {
      $or: fields.map((field) => ({
        $and: tokens.map((token) => {
          const part = normalizer ? normalizer(token) : token;
          const pattern = `\\b${part}\\b`;
          return { [field]: new RegExp(pattern, 'i') };
        }),
      })),
    };
  }

  static buildSmartSearch(
    searchText: string | undefined,
    fields: string[],
    normalizer?: (text: string) => string,
  ): any {
    if (!searchText?.trim()) return {};

    const trimmed = searchText.trim();

    // Si contiene separadores, usar búsqueda por tokens
    if (/[,\-_.\s]/.test(trimmed)) {
      return this.buildTokenSearch(trimmed, fields, normalizer);
    }

    // Búsqueda simple con variaciones de plural/singular
    const variations = generatePluralVariations(trimmed);
    const normalizedVariations = variations.map((v) => (normalizer ? normalizer(v) : v));

    // Crear un regex que coincida con cualquiera de las variaciones
    const pattern = normalizedVariations.join('|');
    const regex = new RegExp(pattern, 'i');

    return {
      $or: fields.map((field) => ({ [field]: new RegExp(bounded, 'i') })),
    };
  }

  static buildWeightedSearch(searchText: string | undefined): Record<string, unknown> {
    if (!searchText?.trim()) return {};

    return {
      $text: { $search: searchText.trim() },
    };
  }
}
