import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PhantomProvider } from './wallet/PhantomProvider';
import { AuthProvider } from './contexts/AuthProvider'; // Garantindo que AuthProvider seja envolvido corretamente

import Home from './pages/Home';
import Admin from './pages/Admin'; // Adicionando o Admin
import Login from './pages/Login';
import Airdrop from './pages/Airdrop';
import Referrals from './pages/Referrals';

export default function App() {
  return (
    <BrowserRouter>
      <PhantomProvider>
        <AuthProvider> {/* AuthProvider agora está dentro do BrowserRouter */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} /> {/* Rota para Admin */}
            <Route path="/login" element={<Login />} />
            <Route path="/airdrop" element={<Airdrop />} />
            <Route path="/referrals" element={<Referrals />} />
          </Routes>
        </AuthProvider>
      </PhantomProvider>
    </BrowserRouter>
  );
}
