import { User } from 'src/app/core/models/user.model';
import { UserDTO } from '../../../core/models/user-api.models';
import { NovelDTO } from './novel-api.models';
import { Tag } from './tag.model';

export class Novel {
  id?: number;
  author: User;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  tags: Tag[];

  constructor(novelData: NovelDTO, author: User, tags: Tag[]) {
    this.id = novelData.id;
    this.title = novelData.title;
    this.content = novelData.content ? novelData.content : '';
    this.author = author;
    this.createdAt = novelData.createdAt;
    this.updatedAt = novelData.updatedAt;
    this.tags = tags;
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
