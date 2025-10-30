// services/common/search.service.ts
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
   * Búsqueda con normalizador (para acentos, etc)
   */
  static buildWithNormalizer(
    searchText: string | undefined,
    fields: string[],
    normalizer: (text: string) => string,
  ): any {
    if (!searchText?.trim()) return {};

    const normalized = normalizer(searchText.trim());
    const regex = new RegExp(normalized, 'i');
    return {
      $or: fields.map((field) => ({ [field]: regex })),
    };
  }

  /**
   * Búsqueda por tokens (palabras separadas)
   * Busca documentos que contengan TODOS los tokens
   */
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

    // Si solo hay un token, usar búsqueda simple
    if (tokens.length === 1) {
      const pattern = normalizer ? normalizer(tokens[0]) : tokens[0];
      const regex = new RegExp(pattern, 'i');
      return {
        $or: fields.map((field) => ({ [field]: regex })),
      };
    }

    // Múltiples tokens: cada campo debe contener TODOS los tokens
    const tokenRegexes = tokens.map((token) => {
      const pattern = normalizer ? normalizer(token) : token;
      return new RegExp(pattern, 'i');
    });

    return {
      $or: fields.map((field) => ({
        $and: tokenRegexes.map((regex) => ({ [field]: regex })),
      })),
    };
  }

  /**
   * Búsqueda inteligente: detecta si debe buscar por tokens o simple
   */
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

    // Búsqueda simple
    const pattern = normalizer ? normalizer(trimmed) : trimmed;
    const regex = new RegExp(pattern, 'i');
    return {
      $or: fields.map((field) => ({ [field]: regex })),
    };
  }

  /**
   * Búsqueda con pesos (prioriza ciertos campos)
   * MongoDB no soporta esto nativamente, pero puedes usar $text index
   */
  static buildWeightedSearch(
    searchText: string | undefined,
    fieldsConfig: Array<{ field: string; weight: number }>,
  ): any {
    if (!searchText?.trim()) return {};

    // Para usar con MongoDB text index
    return {
      $text: { $search: searchText.trim() },
    };
  }
}
