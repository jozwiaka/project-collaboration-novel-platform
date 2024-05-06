import { Page } from 'src/app/core/models/api.models';
import { Message } from '../../../models/message.model';

export interface MessageData {
  messages: Message[];
  page: Page;
}
