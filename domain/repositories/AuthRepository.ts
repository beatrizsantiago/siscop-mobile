import User from '@domain/entities/User';

export interface AuthRepository {
  login(data: User): Promise<string>;
  register(data: User): Promise<string>;
  loginWithGoogle(): Promise<string>;
};