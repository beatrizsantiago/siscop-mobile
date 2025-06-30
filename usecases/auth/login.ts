import User from '@/domain/entities/User';
import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { asyncStorageService } from '@/infrastructure/services/asyncStorage';

type LoginParams = {
  email: string;
  password: string;
};


class LoginUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(params: LoginParams) {
    const login = new User(
      '',
      params.email,
      params.password,
      '',
    );

    const token = await this.repository.login(login);
    await asyncStorageService.setToken(token);
    return true;
  };
};

export default LoginUseCase;
