import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

export default function PrivateRoute({ children }) {
  const { publicKey, connected } = useWallet();
  const walletAddress = publicKey?.toBase58();

  const isAdmin = walletAddress === '4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD';

  if (!connected || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
