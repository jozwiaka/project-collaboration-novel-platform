import { Page } from 'src/app/core/api/util.api';

export interface CollaboratorDTO {
  id?: number;
  userId: number;
  novelId: number;
  readOnly: boolean;
  createdAt?: string;
}

export interface CollaboratorsResponse {
  _embedded: {
    collaborators: CollaboratorDTO[];
  };
  page: Page;
}

export enum CollaboratorsSortBy {
  CreatedAt = 'createdAt',
}
