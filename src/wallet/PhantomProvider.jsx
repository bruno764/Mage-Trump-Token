import React, { createContext, useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';

export const WalletContext = createContext();

export const PhantomProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Função para conectar a carteira
  const connectWallet = async () => {
    const provider = window?.solana;

    if (!provider || !provider.isPhantom) {
      alert('Phantom wallet not found!');
      return;
    }

    const resp = await provider.connect();
    const publicKey = resp.publicKey.toString();

    setWalletAddress(publicKey);
    setIsConnected(true); // Atualizando o estado de conexão

    // Armazenar a carteira no localStorage
    localStorage.setItem('walletAddress', publicKey);
  };

  // Função para desconectar a carteira
  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false); // Atualiza o estado quando a carteira for desconectada
    localStorage.removeItem('walletAddress');
  };

  // Verificar se a carteira já está conectada ao carregar a página
  useEffect(() => {
    const storedWallet = localStorage.getItem('walletAddress');
    if (storedWallet) {
      setWalletAddress(storedWallet);
      setIsConnected(true); // Atualiza o estado com a carteira armazenada
    }
  }, []);

  return (
    <WalletContext.Provider value={{ connectWallet, disconnectWallet, walletAddress, walletBalance, isConnected }}>
      {children}
    </WalletContext.Provider>
  );
};
