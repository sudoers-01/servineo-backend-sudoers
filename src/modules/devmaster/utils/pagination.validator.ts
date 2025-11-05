// utils/pagination.validator.ts

export interface PaginationValidationResult {
  isValid: boolean;
  currentPage: number;
  totalPages: number;
  errorMessage?: string;
}

/**
 * Valida si la página solicitada está dentro del rango válido
 */
export function validatePageRange(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number,
): PaginationValidationResult {
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;

  // Si no hay items, cualquier página es válida (retornará array vacío)
  if (totalItems === 0) {
    return {
      isValid: true,
      currentPage: 1,
      totalPages: 0,
    };
  }

  // Validar que la página esté en rango válido
  if (currentPage < 1 || currentPage > totalPages) {
    return {
      isValid: false,
      currentPage,
      totalPages,
      errorMessage: `Página ${currentPage} fuera de rango. Total de páginas disponibles: ${totalPages}`,
    };
  }

  return {
    isValid: true,
    currentPage,
    totalPages,
  };
}

/**
 * Calcula el total de páginas
 */
export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  return totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;
}

/**
 * Valida y normaliza el número de página desde query params
 */
export function normalizePageParam(pageParam: any, defaultPage: number = 1): number {
  const page = Number(pageParam);
  return !isNaN(page) && page > 0 ? page : defaultPage;
}
