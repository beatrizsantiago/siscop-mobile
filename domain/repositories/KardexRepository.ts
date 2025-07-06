import Kardex from '@/domain/entities/Kardex';
import { ProducsByStateDataType } from '@/types/chart';

export interface KardexRepository {
  getByFarmProductState(farmId: string, productId: string, state: string): Promise<Kardex | null>;
  updateAmount(id: string, amount: number): Promise<void>;
  create(kardex: Kardex): Promise<void>;
  getProductsByState(state: string): Promise<ProducsByStateDataType>;
};
