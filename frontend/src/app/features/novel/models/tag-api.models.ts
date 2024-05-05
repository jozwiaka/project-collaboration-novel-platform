import { Page } from 'src/app/core/models/api.models';

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
