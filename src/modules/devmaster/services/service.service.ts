import { FilterQuery } from 'mongoose';
import { Service } from './service.model';

export async function searchServicesByName(name?: string) {
  const filter: FilterQuery<typeof Service> = {};

  if (name) {
    const regex = new RegExp(escapeRegex(name));
    Object.assign(filter, { name: regex });
  }

  const [data, total] = await Promise.all([
    Service.find(filter).limit(50).lean(),
    Service.countDocuments(filter),
  ]);

  return { data, total };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
