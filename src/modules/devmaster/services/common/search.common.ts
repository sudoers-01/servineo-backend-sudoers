import { normalizeSearchText } from '../../utils/search.normalizer';

function matchesAllTokens<T>(item: T, searchText: string, fields: (keyof T)[]): boolean {
  const tokens = searchText
    .trim()
    .split(/[\s,\-_.]+/)
    .filter((token) => token.length > 0);

  if (tokens.length === 0) return false;

  const regexPatterns = tokens.map((token) => {
    const pattern = normalizeSearchText(token);
    return new RegExp(pattern, 'i');
  });

  const fieldsToSearch = fields.map((field) => String(item[field] || '')).join(' ');

  return regexPatterns.every((regex) => regex.test(fieldsToSearch));
}

export function search<T>(items: T[], searchText: string, fields: (keyof T)[]): T[] {
  const trimmed = searchText.trim();

  if (/[,\-_.\s]/.test(trimmed)) {
    return items.filter((item) => matchesAllTokens(item, trimmed, fields));
  }

  const searchPattern = normalizeSearchText(trimmed);
  const regex = new RegExp(searchPattern, 'i');

  return items.filter((item) => {
    return fields.some((field) => regex.test(String(item[field] || '')));
  });
}
