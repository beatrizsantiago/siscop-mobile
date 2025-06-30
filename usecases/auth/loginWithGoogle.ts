import { AuthRepository } from '@/domain/repositories/AuthRepository';
import { asyncStorageService } from '@/infrastructure/services/asyncStorage';

class LoginWithGoogleUseCase {
  constructor(private repository: AuthRepository) {}

  async execute() {
    const token = await this.repository.loginWithGoogle();
    await asyncStorageService.setToken(token);
    return true;
  };
};

export default LoginWithGoogleUseCase;
