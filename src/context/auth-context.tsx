
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { app } from "@/lib/firebase";

import { getUserProfile } from "@/lib/user-service";
import type { User } from "@/lib/types";

type AuthContextType = {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const refreshUserProfile = useCallback(async () => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  }, [user]);

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create user profile in Firestore after successful signup
    if (result.user) {
      try {
        const { createUserProfile } = await import("@/lib/user-service");
        await createUserProfile(result.user.uid, {
          email: result.user.email || "",
          name: result.user.displayName || result.user.email || "",
        });
      } catch (error) {
        console.error("Error creating user profile:", error);
      }
    }
    return result;
  };
  
  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
    
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Create user profile if it's a new user
    if (result.user) {
      try {
        const { createUserProfile } = await import("@/lib/user-service");
        await createUserProfile(result.user.uid, {
          email: result.user.email || "",
          name: result.user.displayName || result.user.email || "",
        });
      } catch (error) {
        console.error("Error creating user profile:", error);
      }
    }
    return result;
  };
  const signOutUser = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, refreshUserProfile, signUp, signIn, signInWithGoogle, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};


