// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const firebaseReady = Object.values(firebaseConfig).every((v) => Boolean(v));

let app = null;
let authInstance = null;
let provider = null;

if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  provider = new GoogleAuthProvider();
}

export const auth = authInstance;
export const googleProvider = provider;
export default app;
