// src/modules/devmaster/services/sort.service.ts
import { Profile } from '../modules/profile.model';
import { User } from '../modules/user.model';
import { SortCriteria, DEFAULT_SORT_CONFIG } from '../utils/queryParams.types';
import { getMultipleFixersRatings } from './rating.service';

function normalize(text: string): string {
  return text
    ? text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
}

function normalizeNumber(num?: string | number | null): number {
  if (!num) return 0;
  const parsed = Number(String(num).replace(/\D/g, '')); // eliminar caracteres no numéricos
  return isNaN(parsed) ? 0 : parsed;
}

export const getAllFixers = async (options?: { sortBy?: SortCriteria }) => {
  const sortBy = options?.sortBy || DEFAULT_SORT_CONFIG.sortBy;

  const fixers = await User.find({ role: 'fixer' }).select('name createdAt updatedAt').lean();

  // Obtener perfiles con teléfono
  const userIds = fixers.map((f) => f._id);
  const profiles = await Profile.find({ userId: { $in: userIds } })
    .select('userId phone')
    .lean();

  const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
  const ratingsMap = await getMultipleFixersRatings(userIds.map((id) => id.toString()));

  // Combinar datos
  const combinedFixers = fixers.map((fixer) => {
    const rating = ratingsMap.get(fixer._id.toString());
    const profile = profileMap.get(fixer._id.toString());

    return {
      _id: fixer._id,
      name: fixer.name,
      createdAt: fixer.createdAt,
      phone: profile?.phone || null,
      rating: rating?.averageRating || 0,
      totalReviews: rating?.totalReviews || 0,
    };
  });

  // Ordenar según el criterio
  combinedFixers.sort((a, b) => {
    switch (sortBy) {
      case SortCriteria.DATE_RECENT:
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      case SortCriteria.DATE_OLDEST:
        return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
      case SortCriteria.NAME_ASC:
        return normalize(a.name).localeCompare(normalize(b.name));
      case SortCriteria.NAME_DESC:
        return normalize(b.name).localeCompare(normalize(a.name));
      case SortCriteria.RATING:
        return b.rating - a.rating;
      case SortCriteria.CONTACT_ASC:
        return normalizeNumber(a.phone) - normalizeNumber(b.phone);
      case SortCriteria.CONTACT_DESC:
        return normalizeNumber(b.phone) - normalizeNumber(a.phone);
      default:
        return 0;
    }
  });

  return { data: combinedFixers };
};
