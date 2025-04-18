import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA6Wx-C3VoWQjTVZL0F0boV0_wnxjOAwJg",
  authDomain: "mage-trump-token.firebaseapp.com",
  projectId: "mage-trump-token",
  storageBucket: "mage-trump-token.appspot.com",
  messagingSenderId: "836220096383",
  appId: "1:836220096383:web:e3e9a3d24f1f6a18f0b9d2"
};

// ✅ Evita erro de inicialização duplicada
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
