import User from '@/domain/entities/User';
import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { asyncStorageService } from '@/infrastructure/services/asyncStorage';
import { capitalizeFirstLetter } from '@/utils/format';

type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

class RegisterUseCase {
  constructor(private repository: AuthRepository) {}

  async execute(params: RegisterParams) {
    const newUser = new User(
      '',
      params.email,
      params.password,
      capitalizeFirstLetter(params.name),
    );

    const token = await this.repository.register(newUser);
    await asyncStorageService.setToken(token);
    return true;
  }
};

export default RegisterUseCase;