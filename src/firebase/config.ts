import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC7h44bkM5217V0QaIkBTZokMtaGQaWJJw",
  authDomain: "club-ecd44.firebaseapp.com",
  projectId: "club-ecd44",
  storageBucket: "club-ecd44.firebasestorage.app",
  messagingSenderId: "100476508209",
  appId: "1:100476508209:web:c24a5000a4c2b11c2d1d10"
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
