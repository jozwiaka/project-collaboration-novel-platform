import { Page } from 'src/app/shared/models/api.models';

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

// export enum TagsSortBy {
//   CreatedAt = 'createdAt',
// }
