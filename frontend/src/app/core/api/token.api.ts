export interface TokenDTO {
  id?: number;
  userId: number;
  token: string;
  expirationDate: string;
  createdAt?: string;
}
