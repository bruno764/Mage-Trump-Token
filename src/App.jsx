import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PhantomProvider } from './wallet/PhantomProvider';
import { AuthProvider } from './contexts/AuthProvider';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Airdrop from './pages/Airdrop';
import Referrals from './pages/Referrals';

export default function App() {
  return (
    <PhantomProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/airdrop" element={<Airdrop />} />
            <Route path="/referrals" element={<Referrals />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </PhantomProvider>
  );
}
