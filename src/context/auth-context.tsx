
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User 
} from "firebase/auth";
import { app } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, pass: string) => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signUp = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };
  
  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signOutUser = () => {
    return signOut(auth);
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
