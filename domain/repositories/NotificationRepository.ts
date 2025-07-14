import Notification from '@/domain/entities/Notification';
import { DocumentSnapshot } from 'firebase/firestore';

export interface NotificationRepository {
  getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Notification[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }>;
  create(params: Notification): Promise<void>;
};