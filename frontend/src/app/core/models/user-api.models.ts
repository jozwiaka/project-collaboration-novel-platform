import { Page } from 'src/app/shared/models/api.models';

export interface UserDTO {
  id?: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  _embedded: {
    users: UserDTO[];
  };
  page: Page;
}

export enum UsersSortBy {
  Name = 'name',
}
