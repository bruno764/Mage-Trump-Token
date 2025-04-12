import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { publicKey, connected, disconnect, select } = useWallet();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const walletAddress = publicKey?.toBase58();

  const connectWallet = () => select('Phantom'); // ou usar Modal
  const disconnectWallet = () => disconnect();

  const handleAccess = () => {
    if (walletAddress === '4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD') {
      navigate('/admin');
    } else {
      setError('❌ Access denied: only the admin wallet can access this panel.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center px-4">
      <div className="bg-[#111827] p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-700">
        <h1 className="text-3xl font-extrabold mb-6">Admin Login</h1>

        <button
          onClick={connected ? disconnectWallet : connectWallet}
          className={`w-full py-3 rounded-lg font-semibold transition duration-300 mb-4 ${
            connected ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>

        {connected && (
          <div className="text-sm mb-4 text-gray-300">
            ✅ Connected: <span className="font-mono text-yellow-300">{walletAddress}</span>
          </div>
        )}

        <button
          onClick={handleAccess}
          disabled={!connected}
          className="w-full py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-40 transition"
        >
          Access Admin Panel
        </button>

        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
}
