import { User } from 'src/app/core/models/user.model';
import { Novel } from './novel.model';
import { CollaboratorDTO } from './collaborator-api.models';

export class Collaborator {
  id?: number;
  user: User;
  novel: Novel;
  readOnly: boolean;
  createdAt?: string;

  constructor(collaboratorData: CollaboratorDTO, user: User, novel: Novel) {
    this.id = collaboratorData.userId;
    this.user = user;
    this.novel = novel;
    this.readOnly = collaboratorData.readOnly;
    this.createdAt = collaboratorData.createdAt;
  }

  getData(): CollaboratorDTO {
    return {
      id: this.id,
      userId: this.user.id ? this.user.id : 0,
      novelId: this.novel.id ? this.novel.id : 0,
      readOnly: this.readOnly,
      createdAt: this.createdAt,
    };
  }
}
