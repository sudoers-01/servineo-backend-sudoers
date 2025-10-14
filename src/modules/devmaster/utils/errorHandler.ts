/**
 * Respuesta de error estandarizada
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  timestamp: string;
}

/**
 * Crea una respuesta de error controlada
 */
export function createErrorResponse(error: any, customMessage?: string): ErrorResponse {
  return {
    success: false,
    message: customMessage || 'Error en la operación',
    error: error instanceof Error ? error.message : String(error),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Registra error en consola
 */
export function logError(error: any, context?: string): void {
  console.error(`[ERROR]${context ? ` ${context}:` : ''}`, error);
}
