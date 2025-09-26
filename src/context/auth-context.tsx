
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

  const signUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);
  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
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


