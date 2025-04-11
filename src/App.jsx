import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletConnectionProvider } from './wallet/WalletProvider';
import { AuthProvider } from './contexts/AuthProvider';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Airdrop from './pages/Airdrop';
import Referrals from './pages/Referrals';
import About from './pages/About';

export default function App() {
  return (
    <WalletConnectionProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/airdrop" element={<Airdrop />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </WalletConnectionProvider>
  );
}
