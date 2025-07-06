import Kardex from '@/domain/entities/Kardex';
import { KardexRepository } from '@/domain/repositories/KardexRepository';
import { ProducsByStateDataType } from '@/types/chart';
import {
  addDoc, collection, doc, DocumentReference, getDoc,
  getDocs, query, updateDoc, where, writeBatch,
} from 'firebase/firestore';

import { firestore } from './config';

class KardexService implements KardexRepository {
  async getByFarmProductState(farmId: string, productId: string, state: string): Promise<Kardex | null> {
    const farmRef = doc(firestore, 'farms', farmId);
    const productRef = doc(firestore, 'products', productId);

    const q = query(
      collection(firestore, 'kardex'),
      where('farm_id', '==', farmRef),
      where('product_id', '==', productRef),
      where('state', '==', state)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    return new Kardex(
      docSnap.id,
      farmId,
      productId,
      state,
      data.amount,
    );
  };

  async updateAmount(id: string, newAmount: number): Promise<void> {
    const ref = doc(firestore, 'kardex', id);
    await updateDoc(ref, { amount: newAmount });
  };

  async create(kardex: Kardex): Promise<void> {
    const farmRef = doc(firestore, 'farms', kardex.farm_id);
    const productRef = doc(firestore, 'products', kardex.product_id);

    await addDoc(collection(firestore, 'kardex'), {
      farm_id: farmRef,
      product_id: productRef,
      state: kardex.state,
      amount: kardex.amount,
    });
  };

  async getProductsByState(state: string): Promise<ProducsByStateDataType> {
    const q = query(
      collection(firestore, 'kardex'),
      where('state', '==', state)
    );

    const snapshot = await getDocs(q);

    const productMap: Record<string, { name: string; amount: number }> = {};

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const amount = data.amount ?? 0;
      if (amount <= 0) continue;

      const productRef = data.product_id as DocumentReference;
      const productSnap = await getDoc(productRef);
      const productData = productSnap.data();
      const productId = productRef.id;
      const productName = productData?.name ?? '';

      if (!productMap[productId]) {
        productMap[productId] = { name: productName, amount: 0 };
      }

      productMap[productId].amount += amount;
    }

    return Object.entries(productMap).map(([, { name, amount }]) => ({
      productName: name,
      amount,
    }));
  };

  async getAvailableAmount(farmId: string, productId: string): Promise<number> {
    const farmRef = doc(firestore, 'farms', farmId);
    const productRef = doc(firestore, 'products', productId);

    const q = query(
      collection(firestore, 'kardex'),
      where('farm_id', '==', farmRef),
      where('product_id', '==', productRef),
      where('state', '==', 'READY')
    );

    const snapshot = await getDocs(q);
    let total = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();
      total += data.amount || 0;
    });

    return total;
  };

  async consumeStock(farmId: string, productId: string, amount: number): Promise<void> {
    const farmRef = doc(firestore, 'farms', farmId);
    const productRef = doc(firestore, 'products', productId);

    const q = query(
      collection(firestore, 'kardex'),
      where('farm_id', '==', farmRef),
      where('product_id', '==', productRef),
      where('state', '==', 'READY')
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(firestore);
    let toConsume = amount;

    for (const kardexDoc of snapshot.docs) {
      if (toConsume <= 0) break;

      const data = kardexDoc.data();
      const current = data.amount || 0;
      const consume = Math.min(current, toConsume);
      const ref = doc(firestore, 'kardex', kardexDoc.id);

      const newAmount = current - consume;
      batch.update(ref, { amount: newAmount });

      toConsume -= consume;
    }

    await batch.commit();
  };

  async restoreStock(farmId: string, productId: string, amount: number): Promise<void> {
    const farmRef = doc(firestore, 'farms', farmId);
    const productRef = doc(firestore, 'products', productId);

    const q = query(
      collection(firestore, 'kardex'),
      where('farm_id', '==', farmRef),
      where('product_id', '==', productRef),
      where('state', '==', 'READY')
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(firestore);

    const firstDoc = snapshot.docs[0];
    const current = firstDoc.data().amount || 0;
    batch.update(doc(firestore, 'kardex', firstDoc.id), {
      amount: current + amount
    });

    await batch.commit();
  }
};

export const firebaseKardex = new KardexService();
