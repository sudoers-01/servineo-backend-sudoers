// utils/filterCountsValidator.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CountObject {
  [key: string]: number;
}

export class FilterCountValidator {
  /**
   * Valida que todos los conteos sean válidos (no negativos, no duplicados)
   */
  static validateCounts(
    fixers: CountObject,
    cities: CountObject,
    categories: CountObject,
    ratings: CountObject,
    total: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Validar que total no sea negativo
    if (total < 0) {
      errors.push(`Total count is negative: ${total}`);
    }

    // 2. Validar cada objeto de conteo
    this.validateCountObject('fixers', fixers, errors, warnings);
    this.validateCountObject('cities', cities, errors, warnings);
    this.validateCountObject('categories', categories, errors, warnings);
    this.validateCountObject('ratings', ratings, errors, warnings);

    // 3. Validar que no haya claves vacías
    this.validateEmptyKeys('fixers', fixers, errors);
    this.validateEmptyKeys('cities', cities, errors);
    this.validateEmptyKeys('categories', categories, errors);
    this.validateEmptyKeys('ratings', ratings, errors);

    // 4. Advertencia si total es 0 pero hay conteos
    if (total === 0) {
      const hasAnyCounts = 
        Object.keys(fixers).length > 0 ||
        Object.keys(cities).length > 0 ||
        Object.keys(categories).length > 0 ||
        Object.keys(ratings).length > 0;
      
      if (hasAnyCounts) {
        warnings.push('Total is 0 but individual counts exist');
      }
    }

    // 5. Advertencia si hay valores inusualmente altos
    this.checkUnusuallyHighValues(fixers, 'fixers', warnings);
    this.checkUnusuallyHighValues(cities, 'cities', warnings);
    this.checkUnusuallyHighValues(categories, 'categories', warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Valida un objeto de conteo individual
   */
  private static validateCountObject(
    name: string,
    counts: CountObject,
    errors: string[],
    warnings: string[]
  ): void {
    const keys = Object.keys(counts);
    const seenKeys = new Set<string>();

    for (const key of keys) {
      const value = counts[key];

      // Verificar conteos negativos
      if (value < 0) {
        errors.push(`${name}.${key} has negative count: ${value}`);
      }

      // Verificar que sea un número válido
      if (!Number.isFinite(value)) {
        errors.push(`${name}.${key} has invalid count: ${value}`);
      }

      // Verificar duplicados (case-insensitive para detectar posibles errores)
      const keyLower = key.toLowerCase();
      if (seenKeys.has(keyLower)) {
        warnings.push(`${name} has potential duplicate key: "${key}"`);
      }
      seenKeys.add(keyLower);

      // Advertencia para conteos de 0
      if (value === 0) {
        warnings.push(`${name}.${key} has zero count`);
      }
    }
  }

  /**
   * Valida que no haya claves vacías o inválidas
   */
  private static validateEmptyKeys(
    name: string,
    counts: CountObject,
    errors: string[]
  ): void {
    for (const key of Object.keys(counts)) {
      if (!key || key.trim() === '') {
        errors.push(`${name} contains empty or whitespace-only key`);
      }
    }
  }

  /**
   * Detecta valores inusualmente altos que podrían indicar un error
   */
  private static checkUnusuallyHighValues(
    counts: CountObject,
    name: string,
    warnings: string[]
  ): void {
    const values = Object.values(counts);
    if (values.length === 0) return;

    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    // Si el máximo es más de 100 veces el promedio, podría ser un error
    if (max > avg * 100 && avg > 0) {
      warnings.push(
        `${name} has unusually high value (${max}) compared to average (${avg.toFixed(2)})`
      );
    }
  }

  /**
   * Valida la consistencia de los datos (método auxiliar para uso futuro)
   */
  static validateConsistency(
    fixers: CountObject,
    cities: CountObject,
    categories: CountObject,
    total: number
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // La suma de conteos individuales puede ser diferente al total
    // debido a agregaciones, pero podemos advertir sobre grandes discrepancias
    const fixerSum = Object.values(fixers).reduce((a, b) => a + b, 0);
    
    if (fixerSum > 0 && total > 0) {
      const ratio = fixerSum / total;
      
      // Si la suma de fixers es muy diferente al total, advertir
      if (ratio > 1.5 || ratio < 0.5) {
        warnings.push(
          `Fixer count sum (${fixerSum}) differs significantly from total (${total}). Ratio: ${ratio.toFixed(2)}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}