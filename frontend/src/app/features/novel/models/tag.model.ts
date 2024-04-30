import { User } from 'src/app/core/models/user.model';
import { Novel } from './novel.model';
import { TagDTO } from './tag-api.models';

export class Tag {
  id?: number;
  name: string;
  user: User;
  totalElements: number;

  constructor(tagData: TagDTO, user: User, totalElements: number) {
    this.id = tagData.userId;
    this.name = tagData.name;
    this.user = user;
    this.totalElements = totalElements;
  }

  getData(): TagDTO {
    return {
      id: this.id,
      name: this.name,
      userId: this.user.id ? this.user.id : 0,
    };
  }
}
