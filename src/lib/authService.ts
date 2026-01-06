// src/lib/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously as firebaseSignInAnonymously,
  User,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth';
import { auth } from './firebase';
import { ensureUserDoc } from './userService';

export async function signUpWithEmail(email: string, password: string) {
  const currentUser = auth.currentUser;

  // If user is currently anonymous, link the credential to preserve their usage data
  if (currentUser && currentUser.isAnonymous) {
    const credential = EmailAuthProvider.credential(email, password);

    try {
      const cred = await linkWithCredential(currentUser, credential);
      await ensureUserDoc(cred.user.uid, cred.user.email);
      return cred;
    } catch (error: any) {
      // If email is already in use, fall back to normal sign-in
      if (error.code === 'auth/email-already-in-use') {
        return signInWithEmail(email, password);
      }
      throw error;
    }
  }

  // Normal signup flow for non-anonymous users
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred.user.uid, cred.user.email);
  return cred;
}

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signInAnonymously() {
  return firebaseSignInAnonymously(auth);
}

export function logOut() {
  return signOut(auth);
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}
