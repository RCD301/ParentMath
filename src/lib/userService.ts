// src/lib/userService.ts
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export async function ensureUserDoc(uid: string, email?: string | null) {
  console.log("ensureUserDoc called for", uid, email);
  
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      createdAt: serverTimestamp(),
      email: email ?? null,
      plan: 'free',
      freeUsesUsed: 0,
      lastUsedAt: serverTimestamp(),
      stripeCustomerId: null,
      subscriptionStatus: 'inactive',
    });
  } else {
    await updateDoc(ref, {
      lastUsedAt: serverTimestamp(),
    });
  }

  return ref;
}
