import { Page } from 'src/app/core/api/util.api';

export interface MessageDTO {
  id?: number;
  userId: number;
  novelId: number;
  content: string;
  createdAt?: string;
}

export interface MessagesResponse {
  _embedded: {
    messages: MessageDTO[];
  };
  page: Page;
}

export enum MessagesSortBy {
  UpdatedAt = 'updatedAt',
}
