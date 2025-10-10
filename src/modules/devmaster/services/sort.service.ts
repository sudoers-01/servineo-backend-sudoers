// src/modules/devmaster/services/sort.service.ts
import { User } from './user.model';

type SortBy = 'name_asc' | 'name_desc' | 'recent';

function normalize(text: string): string {
  return text
    ? text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
}

export const getAllFixers = async (options?: { sortBy?: SortBy }) => {
  const sortBy = options?.sortBy || 'name_asc';
  const fixers = await User.find({ role: 'fixer' }).select('name createdAt').lean();

  fixers.sort((a, b) => {
    if (sortBy === 'recent') {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    }

    const nameA = normalize(a.name);
    const nameB = normalize(b.name);
    return sortBy === 'name_asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  return { data: fixers };
};
