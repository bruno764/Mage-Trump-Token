
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYOFhmThtA_5F9h67lGPLXuO0ZZixy29o",
  authDomain: "mage-trump-token.firebaseapp.com",
  projectId: "mage-trump-token",
  storageBucket: "mage-trump-token.firebasestorage.app",
  messagingSenderId: "974753040843",
  appId: "1:974753040843:web:8de9a9f42ac4f24550ce4e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
