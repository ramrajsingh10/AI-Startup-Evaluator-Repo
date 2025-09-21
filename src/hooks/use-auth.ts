// src/hooks/use-auth.ts
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult(true); // Force refresh
          setRole((idTokenResult.claims.role as string) || null);
        } catch (error) {
          console.error("Error getting user role:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };

    getRole();
  }, [user]);

  const signUp = async (email: string, password: string, role: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    // Call the backend to create the user in Firestore
    await fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    return userCredential;
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    // Call the backend to handle the Google sign-in
    await fetch("/api/v1/auth/google-signin", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return result;
  };

  return { user, role, loading, error, signUp, signInWithGoogle };
};
