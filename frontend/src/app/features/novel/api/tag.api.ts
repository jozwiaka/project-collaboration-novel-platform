import { Page } from 'src/app/core/api/util.api';

export interface TagDTO {
  id?: number;
  name: string;
  userId: number;
}

export interface TagsResponse {
  _embedded: {
    tags: TagDTO[];
  };
  page: Page;
}

export enum TagsSortBy {
  Name = 'name',
}
