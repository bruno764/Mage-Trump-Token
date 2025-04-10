// src/firebase/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCYOFhmThtA_5F9h67lGPLXuO0ZZixy29o",
  authDomain: "mage-trump-token.firebaseapp.com",
  databaseURL: "https://mage-trump-token-default-rtdb.firebaseio.com",
  projectId: "mage-trump-token",
  storageBucket: "mage-trump-token.firebasestorage.app",
  messagingSenderId: "974753040843",
  appId: "1:974753040843:web:8de9a9f42ac4f24550ce4e"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
