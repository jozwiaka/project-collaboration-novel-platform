import { Page } from 'src/app/shared/models/api.models';

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
