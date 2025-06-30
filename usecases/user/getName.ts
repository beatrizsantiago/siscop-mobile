import { UserRepository } from '@/domain/repositories/UserRepository';


class GetNameUseCase {
  constructor(private repository: UserRepository) {}

  async execute() {
    const userName = await this.repository.getName();
    return userName;
  };
};

export default GetNameUseCase;
