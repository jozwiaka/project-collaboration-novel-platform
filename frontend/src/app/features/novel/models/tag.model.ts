import { User } from 'src/app/core/models/user.model';
import { Novel } from './novel.model';
import { TagDTO } from './tag-api.models';

export class Tag {
  id?: number;
  name: string;
  novels: Novel[];
  private userId;

  constructor(tagData: TagDTO, novels: Novel[]) {
    this.id = tagData.id;
    this.name = tagData.name;
    this.novels = novels;
    this.userId = tagData.userId;
  }

  getData(): TagDTO {
    return {
      id: this.id,
      name: this.name,
      userId: this.userId,
    };
  }
}
