// src/modules/devmaster/services/sort.service.ts
import { User } from './user.model';

type SortBy = 'name_asc' | 'name_desc';

export const getAllFixers = async (options?: { sortBy?: SortBy }) => {
  const sortBy = options?.sortBy || 'name_asc';
  const fixers = await User.find({ role: 'fixer' }).select('name').lean();

  fixers.sort((a, b) =>
    sortBy === 'name_asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );

  return { data: fixers };
};
