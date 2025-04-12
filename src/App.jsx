import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WalletProvider from './wallet/WalletProvider';
import { AuthProvider } from './contexts/AuthProvider';

import PrivateRoute from './components/PrivateRoute'; // no topo
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Airdrop from './pages/Airdrop';
import Referrals from './pages/Referrals';
import About from './pages/About';

export default function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="*" element={<NotFound />} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/airdrop" element={<Airdrop />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </WalletProvider>
  );
}
