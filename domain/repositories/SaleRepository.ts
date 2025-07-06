import Sale from '@/domain/entities/Sale';
import { DocumentSnapshot } from 'firebase/firestore';

export interface SaleRepository {
  add(sale: Sale): Promise<Sale>;
  getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Sale[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }>;
  findById(id: string): Promise<any>;
  updateStatus(id: string, status: string): Promise<void>;
  findAll(): Promise<Sale[]>;
};
