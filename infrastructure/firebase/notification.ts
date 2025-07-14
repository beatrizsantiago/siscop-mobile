import Notification from '@/domain/entities/Notification';
import { NotificationRepository } from '@/domain/repositories/NotificationRepository';
import {
  addDoc, collection, DocumentSnapshot, getDocs, limit,
  orderBy, query, startAfter, Timestamp,
} from 'firebase/firestore';

import { firestore } from './config';

const PAGE_SIZE = 10;

class FirebaseNotification implements NotificationRepository {
  async getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Notification[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }> {
    const notificationsRef = collection(firestore, 'notifications');

    let q = query(
      notificationsRef,
      orderBy('created_at', 'desc'),
      limit(PAGE_SIZE)
    );

    if (lastDoc) {
      q = query(
        notificationsRef,
        orderBy('created_at', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
    }

    const snapshot = await getDocs(q);

    const list = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const createdAtDate = (data.created_at as any).toDate();
      return new Notification(
        docSnap.id,
        data.kind as string,
        data.farm_name as string,
        createdAtDate
      );
    });

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

    const hasMore = snapshot.docs.length === PAGE_SIZE;

    return {
      list,
      lastDoc: newLastDoc,
      hasMore,
    };
  }

  async create(params: Notification): Promise<void> {
    const notificationsCol = collection(firestore, 'notifications');
    
    const { farm_name, kind, created_at } = params;

    const data = {
      farm_name,
      kind,
      created_at: Timestamp.fromDate(created_at),
    };

    await addDoc(notificationsCol, data);
  }
};

export const firebaseNotification = new FirebaseNotification();
