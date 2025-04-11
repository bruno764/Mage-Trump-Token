import React, { useEffect, useState } from 'react';
import trumpImg from '../assets/trump.png';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';

const Airdrop = () => {
  const { publicKey, connect, disconnect, connected } = useWallet();
  const [refLink, setRefLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (publicKey) {
      const baseUrl = window.location.origin;
      setRefLink(`${baseUrl}/?ref=${publicKey.toBase58()}`);
      localStorage.setItem('walletConnected', 'true');
    }
  }, [publicKey]);

  useEffect(() => {
    const shouldReconnect = localStorage.getItem('walletConnected') === 'true';
    if (shouldReconnect && !connected) {
      connect().catch(() => {});
    }
  }, []);

  const handleConnect = async () => {
    if (!connected) {
      await connect();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col md:flex-row items-center justify-center p-4">
      <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
        <img src={trumpImg} alt="Trump" className="w-80 md:w-[450px]" />
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Claim your <span className="text-yellow-400">Mage Trump Token</span>
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Connect your Phantom wallet and get your exclusive airdrop. Invite others and earn more!
        </p>
        <button
          onClick={handleConnect}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 mb-4"
        >
          {connected ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
        {refLink && (
          <div className="mt-4">
            <p className="text-sm text-white/80">Your referral link:</p>
            <div className="bg-white text-black px-4 py-2 rounded-xl mt-2 break-all">
              {refLink}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Airdrop;
