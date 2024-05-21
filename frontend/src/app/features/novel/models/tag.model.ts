import { User } from 'src/app/core/models/user.model';
import { Novel } from './novel.model';
import { TagDTO } from '../api/tag.api';

export class Tag {
  id?: number;
  name: string;
  novels: Novel[];
  color: string;

  constructor(tagData: TagDTO, novels: Novel[], randomColor: string) {
    this.id = tagData.id;
    this.name = tagData.name;
    this.novels = novels;
    this.color = randomColor;
  }

  getData(): TagDTO {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
