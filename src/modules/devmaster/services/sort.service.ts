import { User } from './user.model';
import { SortCriteria, DEFAULT_SORT_CONFIG } from '../utils/queryParams.types';

function normalize(text: string): string {
  return text
    ? text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
}

export const getAllFixers = async (options?: { sortBy?: SortCriteria }) => {
  const sortBy = options?.sortBy || DEFAULT_SORT_CONFIG.sortBy;
  const fixers = await User.find({ role: 'fixer' }).select('name createdAt').lean();

  fixers.sort((a, b) => {
    switch (sortBy) {
      case SortCriteria.DATE_RECENT:
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      case SortCriteria.NAME_ASC:
        return normalize(a.name).localeCompare(normalize(b.name));
      case SortCriteria.NAME_DESC:
        return normalize(b.name).localeCompare(normalize(a.name));
      default:
        return 0;
    }
  });

  return { data: fixers };
};
