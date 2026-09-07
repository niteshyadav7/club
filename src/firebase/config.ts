import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration with Vite environment variable support
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC7h44bkM5217V0QaIkBTZokMtaGQaWJJw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "club-ecd44.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "club-ecd44",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "club-ecd44.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "100476508209",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:100476508209:web:c24a5000a4c2b11c2d1d10"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const db = getFirestore(app);
export const storage = getStorage(app);
