import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCYOFhmThtA_5F9h67lGPLXuO0ZZixy29o",
  authDomain: "mage-trump-token.firebaseapp.com",
  databaseURL: "https://mage-trump-token-default-rtdb.firebaseio.com",
  projectId: "mage-trump-token",
  storageBucket: "mage-trump-token.firebasestorage.app",
  messagingSenderId: "974753040843",
  appId: "1:974753040843:web:8de9a9f42ac4f24550ce4e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
