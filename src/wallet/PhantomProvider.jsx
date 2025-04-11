import React, { createContext, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';

export const WalletContext = createContext();

export const PhantomProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    const provider = window?.solana;

    if (!provider || !provider.isPhantom) {
      alert('Phantom wallet not found!');
      return;
    }

    const resp = await provider.connect();
    const publicKey = resp.publicKey.toString();

    setWalletAddress(publicKey);
    setIsConnected(true);
    localStorage.setItem('walletAddress', publicKey);

    // ✅ Notificar no Discord
    await fetch('https://discord.com/api/webhooks/1360353395365380177/5Lejy62BSrPzxKQ-Ak7kaZJ8AROonM0-49o-1_n9oOoAia9Rcg0fGBlSZC_iQHfA6trA', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `📡 Wallet conectada na página principal:\n\`${publicKey}\``
      })
    });
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    localStorage.removeItem('walletAddress');
  };

  useEffect(() => {
    const storedWallet = localStorage.getItem('walletAddress');
    if (storedWallet) {
      setWalletAddress(storedWallet);
      setIsConnected(true);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ connectWallet, disconnectWallet, walletAddress, walletBalance, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
};
