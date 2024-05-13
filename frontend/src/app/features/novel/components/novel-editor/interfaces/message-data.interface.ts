import { Page } from 'src/app/core/api/util.api';
import { Message } from '../../../models/message.model';

export interface MessageData {
  messages: Message[];
  page: Page;
}
