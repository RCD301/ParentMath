// src/lib/usageService.ts
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  createdAt: any;
  email: string | null;
  plan: string;
  freeUsesUsed: number;
  lastUsedAt: any;
  stripeCustomerId: string | null;
  subscriptionStatus: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    return null;
  }

  return snap.data() as UserProfile;
}

export async function consumeUse(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    freeUsesUsed: increment(1),
    lastUsedAt: serverTimestamp(),
  });
}

export function hasProAccess(profile: UserProfile): boolean {
  return profile.subscriptionStatus === 'active' || profile.plan === 'pro';
}

export function canUseFree(profile: UserProfile): boolean {
  return profile.freeUsesUsed < 5;
}
