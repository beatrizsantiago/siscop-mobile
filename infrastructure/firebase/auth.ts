import User from '@/domain/entities/User';
import { AuthRepository } from '@/domain/repositories/AuthRepository';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';

import { auth, googleProvider } from './config';

class FirebaseAuth implements AuthRepository {
  async login({ email, password }:User) {
    const credentials = await signInWithEmailAndPassword(
      auth, email, password,
    );

    return credentials.user.getIdToken();
  }

  async register({ email, password, name }:User) {
    const credentials = await createUserWithEmailAndPassword(
      auth, email, password,
    );

    await updateProfile(credentials.user, {
      displayName: name,
    });

    return credentials.user.getIdToken();
  }

  async loginWithGoogle() {
    const credentials = await signInWithPopup(auth, googleProvider);
    return credentials.user.getIdToken();
  }
};

export const firebaseAuth = new FirebaseAuth();
