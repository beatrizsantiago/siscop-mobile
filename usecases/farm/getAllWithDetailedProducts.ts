import { FarmRepository } from '@/domain/repositories/FarmRepository';

class GetAllWithDetailedProductFarmsUseCase {
  constructor(private repository: FarmRepository) {}

  async execute() {
    const list = await this.repository.getAllWithDetailedProducts();
    return list;
  };
};

export default GetAllWithDetailedProductFarmsUseCase;
