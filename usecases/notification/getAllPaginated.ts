import { NotificationRepository } from '@/domain/repositories/NotificationRepository';
import { DocumentSnapshot } from 'firebase/firestore';

class GetAllPaginatedNotificationUseCase {
  constructor(private repository: NotificationRepository) {}

  async execute(lastDoc?: DocumentSnapshot) {
    const list = await this.repository.getAllPaginated(lastDoc);
    return list;
  };
};

export default GetAllPaginatedNotificationUseCase;
