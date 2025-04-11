import React, { useContext, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { walletAddress, isConnected, connectWallet, disconnectWallet } = useContext(WalletContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAccess = () => {
    // Troque isso por validação real, se desejar
    if (walletAddress === '4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD') {
      navigate('/admin');
    } else {
      setError('❌ Acesso negado: apenas a carteira do administrador pode acessar.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Login</h1>

      <button
        onClick={isConnected ? disconnectWallet : connectWallet}
        className={`${
          isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-semibold py-2 px-6 rounded-lg mb-4 transition duration-300`}
      >
        {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>

      {isConnected && (
        <div className="text-sm mb-4">
          ✅ Connected: <span className="font-mono text-yellow-300">{walletAddress}</span>
        </div>
      )}

      <button
        onClick={handleAccess}
        disabled={!isConnected}
        className="bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        Access Admin Panel
      </button>

      {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
    </div>
  );
}
