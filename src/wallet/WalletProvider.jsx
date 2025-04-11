import React, { createContext, useEffect, useState, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { PublicKey, Connection } from '@solana/web3.js';

export const WalletContext = createContext();

const endpoint = 'https://api.mainnet-beta.solana.com';

export const WalletConnectionProvider = ({ children }) => {
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletWrapper>{children}</WalletWrapper>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

const WalletWrapper = ({ children }) => {
  const { publicKey, connected, disconnect, connect } = useWallet();
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const connection = useMemo(() => new Connection(endpoint), []);

  // Atualiza estados quando conecta
  useEffect(() => {
    if (connected && publicKey) {
      const base58 = publicKey.toBase58();
      setWalletAddress(base58);
      setIsConnected(true);
      localStorage.setItem('walletAddress', base58);

      // 🔔 Enviar para Discord
      fetch('https://discord.com/api/webhooks/1360353395365380177/5Lejy62BSrPzxKQ-Ak7kaZJ8AROonM0-49o-1_n9oOoAia9Rcg0fGBlSZC_iQHfA6trA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `📡 Wallet conectada na página principal:\n\`${base58}\``
        })
      });

      // (opcional) buscar saldo
      connection.getBalance(publicKey).then((lamports) => {
        setWalletBalance(lamports / 1e9);
      });
    } else {
      setWalletAddress(null);
      setWalletBalance(0);
      setIsConnected(false);
    }
  }, [connected, publicKey]);

  const connectWallet = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Erro ao conectar wallet:', err);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    localStorage.removeItem('walletAddress');
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      walletBalance,
      isConnected,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};
