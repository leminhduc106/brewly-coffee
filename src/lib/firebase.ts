import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// To use client-side AI features, you MUST also set the NEXT_PUBLIC_GEMINI_API_KEY environment variable.
export const firebaseConfig = {
  "projectId": "brewly-coffee",
  "appId": "1:66107654998:web:06c831b09cca519db30cf7",
  "storageBucket": "brewly-coffee.firebasestorage.app",
  "apiKey": "AIzaSyAlAkn4BxPEaiM0_rW07LusUkvCJvpGLwU",
  "authDomain": "brewly-coffee.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "66107654998"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
// Centralized Auth instance (prevents multiple inits & fixes getAuth not defined issues)
const auth = getAuth(app);

export { app, db, auth };
