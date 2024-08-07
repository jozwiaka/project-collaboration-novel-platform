import { Page } from 'src/app/core/api/util.api';

export interface NovelDTO {
  id?: number;
  authorId: number;
  title: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NovelsResponse {
  _embedded: {
    novels: NovelDTO[];
  };
  page: Page;
}

export enum NovelsSortBy {
  UpdatedAt = 'updatedAt',
  Title = 'title',
  Author = 'author',
}
