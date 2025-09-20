// src/hooks/use-auth.ts
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          setRole(idTokenResult.claims.role as string || null);
        } catch (error) {
          console.error('Error getting user role:', error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };

    getRole();
  }, [user]);

  return { user, role, loading, error };
};
