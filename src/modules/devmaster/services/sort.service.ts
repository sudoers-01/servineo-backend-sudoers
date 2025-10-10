// src/modules/devmaster/services/sort.service.ts
import { User } from './user.model';

type SortBy = 'name_asc' | 'name_desc';

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
  const fixers = await User.find({ role: 'fixer' }).select('name').lean();

  fixers.sort((a, b) => {
    const nameA = normalize(a.name);
    const nameB = normalize(b.name);
    return sortBy === 'name_asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  return { data: fixers };
};
