// src/hooks/use-auth.ts
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  UserCredential, // Import UserCredential for better typing
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

  const signUp = async (email: string, password: string, role: string): Promise<UserCredential> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      // Call the backend to create the user in Firestore
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        // If backend call fails, it's crucial to delete the Firebase Auth user
        // to prevent orphaned accounts or re-raise the error.
        // For now, let's re-throw the error with backend's message if available.
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create user record in backend.");
      }

      return userCredential;
    } catch (error) {
      console.error("Error during signUp process:", error);
      throw error; // Re-throw to be caught by the calling component
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Call the backend to handle the Google sign-in
      const response = await fetch("/api/v1/auth/google-signin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process Google sign-in in backend.");
      }

      return result;
    } catch (error) {
      console.error("Error during Google signIn process:", error);
      throw error; // Re-throw to be caught by the calling component
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
    try {
      const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken(true); // Force refresh to get claims

      // Optionally, you might still want to call a backend endpoint here
      // to confirm status or fetch additional user data if not done via claims.
      // For now, we rely on claims for role and status check in the frontend.

      return userCredential;
    } catch (error) {
      console.error("Error during email/password signIn process:", error);
      throw error; // Re-throw to be caught by the calling component
    }
  };

  return { user, role, loading, error, signUp, signInWithGoogle, signInWithEmailAndPassword };
};
