import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmQOY5tbxI-0FFl1GpS3LUiqkBQfihUIw",
  authDomain: "erfina-3a823.firebaseapp.com",
  projectId: "erfina-3a823",
  storageBucket: "erfina-3a823.firebasestorage.app",
  messagingSenderId: "47230277115",
  appId: "1:47230277115:web:ffb825e6858dad7e50a75e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firestore persistence failed: Browser not supported');
    }
  });
}

export const googleProvider = new GoogleAuthProvider();
export const isFirebaseReady = true;
