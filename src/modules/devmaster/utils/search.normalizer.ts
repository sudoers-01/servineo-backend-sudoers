export function normalizeSearchText(text: string): string {
  if (!text) {
    return '';
  }

  // Convertir a minúsculas y eliminar espacios al inicio/final
  const trimmedAndLower = text.trim().toLowerCase();

  // Reemplazar múltiples espacios por uno solo
  const singleSpaced = trimmedAndLower.replace(/\s+/g, ' ');

  // Normalizar para separar caracteres base de diacríticos (ej. á -> a + ´)
  // y luego eliminar los diacríticos, excepto para la ñ.
  // La ñ (U+00F1) se descompone en n (U+006E) y tilde (U+0303).
  // La expresión regular /[^\u006E\u0303]/g asegura que no se elimine la tilde de la n.
  const normalized = singleSpaced.normalize('NFD').replace(/[\u0300-\u0302\u0304-\u036f]/g, '');

  return normalized;
}
