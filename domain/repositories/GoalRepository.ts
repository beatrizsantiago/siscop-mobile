import Goal from '@/domain/entities/Goal';
import { DocumentSnapshot } from 'firebase/firestore';

export interface GoalRepository {
  add(goal: Goal): Promise<Goal>;
  getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Goal[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }>;
  delete(id: string): Promise<void>;
};
