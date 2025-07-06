import { KardexRepository } from '@/domain/repositories/KardexRepository';
import { ProducsByStateDataType } from '@/types/chart';

export class GetProductByStateUseCase {
  constructor(private kardexRepository: KardexRepository) {}

  async execute(state:string): Promise<ProducsByStateDataType> {
    return await this.kardexRepository.getProductsByState(state);
  }
};

export default GetProductByStateUseCase;
