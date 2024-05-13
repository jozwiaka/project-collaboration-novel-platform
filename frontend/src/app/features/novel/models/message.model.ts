import { UserDTO } from 'src/app/core/api/user.api';
import { MessageDTO } from '../api/message.api';
import { NovelDTO } from '../api/novel.api';
import { Novel } from './novel.model';
import { User } from 'src/app/core/models/user.model';

export class Message {
  id?: number;
  user: User;
  novel: Novel;
  content: string;
  createdAt?: string;

  constructor(messageData: MessageDTO, user: User, novel: Novel) {
    this.id = messageData.id;
    this.user = user;
    this.novel = novel;
    this.content = messageData.content;
    this.createdAt = messageData.createdAt;
  }

  getData(): MessageDTO {
    return {
      id: this.id,
      novelId: this.novel.id ? this.novel.id : 0,
      userId: this.user.id ? this.user.id : 0,
      content: this.content,
      createdAt: this.createdAt,
    };
  }
}
