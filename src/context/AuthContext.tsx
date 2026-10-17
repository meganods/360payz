"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<AuthResult>;
  signUp: (email: string, pass: string, displayName?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function formatAuthError(errorCode?: string, defaultMessage?: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/user-not-found":
      return "No account exists with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or reset your password.";
    case "auth/weak-password":
      return "Password is too weak. Please choose at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
    case "auth/configuration-not-found":
      return "Email/Password sign-in is not yet enabled in Firebase Console. Please enable it under Authentication > Sign-in method.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Access to this account has been temporarily disabled. Please try again later.";
    default:
      return defaultMessage || "Authentication request failed. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string): Promise<AuthResult> => {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: "Firebase client is not initialized." };
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      return { success: true };
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      return { success: false, error: formatAuthError(error.code, error.message) };
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    displayName?: string
  ): Promise<AuthResult> => {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: "Firebase client is not initialized." };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      return { success: true };
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      return { success: false, error: formatAuthError(error.code, error.message) };
    }
  };

  const signOut = async (): Promise<void> => {
    const auth = getFirebaseAuth();
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: "Firebase client is not initialized." };
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      return { success: false, error: formatAuthError(error.code, error.message) };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
