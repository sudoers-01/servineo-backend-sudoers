/**
 * Tipos de trabajo disponibles
 */
export const JOB_TYPES = [
  'Albañil',
  'Carpintero',
  'Fontanero',
  'Electricista',
  'Pintor',
  'Soldador',
  'Jardinero',
  'Cerrajero',
  'Mecánico',
  'Vidriero',
  'Yesero',
  'Fumigador',
  'Limpiador',
  'Instalador',
  'Montador',
  'Decorador',
  'Pulidor',
  'Techador'
] as const;

export type JobType = typeof JOB_TYPES[number];

/**
 * Obtiene todos los tipos de trabajo disponibles
 */
export const getAllJobTypes = (): JobType[] => {
  return [...JOB_TYPES];
};

/**
 * Valida si un tipo de trabajo es válido
 */
export const isValidJobType = (jobType: string): boolean => {
  return JOB_TYPES.includes(jobType as JobType);
};

/**
 * Normaliza el nombre del tipo de trabajo (capitaliza correctamente)
 */
export const normalizeJobType = (jobType: string): JobType | null => {
  const normalized = jobType.trim();
  
  if (isValidJobType(normalized)) {
    return normalized as JobType;
  }
  
  // Buscar coincidencia insensible a mayúsculas/minúsculas
  const found = JOB_TYPES.find(
    type => type.toLowerCase() === normalized.toLowerCase()
  );
  
  return found || null;
};

/**
 * Obtiene el tipo de trabajo normalizado o lanza error si es inválido
 */
export const validateAndNormalizeJobType = (jobType: string): JobType => {
  const normalized = normalizeJobType(jobType);
  
  if (!normalized) {
    throw new Error(
      `Tipo de trabajo inválido: ${jobType}. Tipos válidos: ${JOB_TYPES.join(', ')}`
    );
  }
  
  return normalized;
};