import Kardex from '@/domain/entities/Kardex';
import { ProducsByStateDataType } from '@/types/chart';

export interface KardexRepository {
  getByFarmProductState(farmId: string, productId: string, state: string): Promise<Kardex | null>;
  updateAmount(id: string, amount: number): Promise<void>;
  create(kardex: Kardex): Promise<void>;
  getProductsByState(state: string): Promise<ProducsByStateDataType>;
  getAvailableAmount(farmId: string, productId: string): Promise<number>;
  consumeStock(farmId: string, productId: string, amount: number): Promise<void>;
  restoreStock(farmId: string, productId: string, amount: number): Promise<void>;
};
