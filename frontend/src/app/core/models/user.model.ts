import { UserDTO } from './user-api.models';

export class User {
  id?: number;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;

  constructor(userData: UserDTO) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.createdAt = userData.createdAt;
    this.updatedAt = userData.updatedAt;
  }

  getData(): UserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
