// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuthChanges, signInAnonymously } from '../lib/authService';
import { ensureUserDoc } from '../lib/userService';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const didAttemptAnon = useRef(false);

  useEffect(() => {
  const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
    setUser(firebaseUser);
    setLoading(false);

    if (firebaseUser) {
      // User is authenticated (anonymous or email)
      try {
        await ensureUserDoc(firebaseUser.uid, firebaseUser.email);
      } catch (err) {
        console.error('Failed to ensure user doc:', err);
      }
    } else if (!didAttemptAnon.current) {
      // No user signed in and haven't tried anonymous auth yet
      didAttemptAnon.current = true;
      try {
        await signInAnonymously();
      } catch (err) {
        console.error('Failed to sign in anonymously:', err);
        // Don't retry - just log the error
      }
    }
  });

  return () => unsubscribe();
}, []);


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
