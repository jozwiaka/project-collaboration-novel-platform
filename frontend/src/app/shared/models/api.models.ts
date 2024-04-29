export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export enum SortDirection {
  Desc = 'desc',
  Asc = 'asc',
}

export interface Sort {
  sortBy: string;
  direction: SortDirection;
}
