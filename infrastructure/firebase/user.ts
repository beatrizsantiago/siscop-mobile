import { UserRepository } from '@/domain/repositories/UserRepository';

import { auth } from './config';

class FirebaseUser implements UserRepository {
  async getName() {
    return auth.currentUser?.displayName || '';
  }
};

export const firebaseUser = new FirebaseUser();

