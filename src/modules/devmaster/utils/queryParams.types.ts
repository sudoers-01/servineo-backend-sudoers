export enum SortCriteria {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  DATE_RECENT = 'recent',
}

export interface SortQueryParams {
  sortBy?: string;
}
