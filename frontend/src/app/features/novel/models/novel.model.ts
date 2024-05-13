import { User } from 'src/app/core/models/user.model';
import { UserDTO } from '../../../core/api/user.api';
import { NovelDTO } from '../api/novel.api';
import { Tag } from './tag.model';

export class Novel {
  id?: number;
  author: User;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;

  constructor(novelData: NovelDTO, author: User) {
    this.id = novelData.id;
    this.title = novelData.title;
    this.content = novelData.content ? novelData.content : '';
    this.author = author;
    this.createdAt = novelData.createdAt;
    this.updatedAt = novelData.updatedAt;
  }

  getData(): NovelDTO {
    return {
      id: this.id,
      authorId: this.author.id ? this.author.id : 0,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
