/**
 * Departamentos de Bolivia
 */
export const DEPARTMENTS = [
  'Beni',
  'Chuquisaca',
  'Cochabamba',
  'La Paz',
  'Oruro',
  'Pando',
  'Potosí',
  'Santa Cruz',
  'Tarija'
] as const;

export type Department = typeof DEPARTMENTS[number];

/**
 * Obtiene todos los departamentos disponibles
 */
export const getAllDepartments = (): Department[] => {
  return [...DEPARTMENTS];
};

/**
 * Valida si un departamento es válido
 */
export const isValidDepartment = (department: string): boolean => {
  return DEPARTMENTS.includes(department as Department);
};

/**
 * Normaliza el nombre del departamento (capitaliza correctamente)
 */
export const normalizeDepartment = (department: string): Department | null => {
  const normalized = department.trim();
  
  if (isValidDepartment(normalized)) {
    return normalized as Department;
  }
  
  // Buscar coincidencia insensible a mayúsculas/minúsculas
  const found = DEPARTMENTS.find(
    dept => dept.toLowerCase() === normalized.toLowerCase()
  );
  
  return found || null;
};

/**
 * Obtiene el departamento normalizado o lanza error si es inválido
 */
export const validateAndNormalizeDepartment = (department: string): Department => {
  const normalized = normalizeDepartment(department);
  
  if (!normalized) {
    throw new Error(
      `Departamento inválido: ${department}. Departamentos válidos: ${DEPARTMENTS.join(', ')}`
    );
  }
  
  return normalized;
};