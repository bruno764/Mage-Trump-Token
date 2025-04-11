import React, { useEffect, useState } from 'react';
import trumpImg from '../assets/trump.png';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import bs58 from 'bs58';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Airdrop = () => {
  const { publicKey, connect, connected } = useWallet();
  const [refLink, setRefLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState('');
  const launchDate = new Date('2025-04-27T00:00:00Z');

  const isValidWallet = (address) => {
    try {
      const decoded = bs58.decode(address);
      return decoded.length === 32;
    } catch (e) {
      return false;
    }
  };

  const blacklist = [
    '2vY6rLpZ7U6u1iX3Kb9TBLk8FWpjmR3SzDeYN2vgqvnU',
    '4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD'
  ];

  useEffect(() => {
    if (publicKey) {
      const walletAddress = publicKey.toBase58();
      const baseUrl = window.location.origin;

      if (!isValidWallet(walletAddress)) {
        alert('❌ Invalid wallet address.');
        return;
      }

      if (blacklist.includes(walletAddress)) {
        alert('🚫 This wallet is not allowed to claim.');
        return;
      }

      const saveUserIfValid = async () => {
        const docRef = doc(db, 'users', walletAddress);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, {
            wallet: walletAddress,
            referral: new URLSearchParams(window.location.search).get('ref') || null,
            createdAt: new Date().toISOString(),
            claimed: false
          });
        }
      };

      setRefLink(`${baseUrl}/?ref=${walletAddress}`);
      localStorage.setItem('walletConnected', 'true');
      saveUserIfValid();
    }
  }, [publicKey]);

  useEffect(() => {
    const shouldReconnect = localStorage.getItem('walletConnected') === 'true';
    if (shouldReconnect && !connected) {
      connect().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = launchDate.getTime() - now.getTime();

      if (distance < 0) {
        setCountdown('Claim is now available!');
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    if (!connected) {
      await connect();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col md:flex-row items-center justify-center p-6">
      <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
        <img src={trumpImg} alt="Trump" className="w-72 md:w-[450px]" />
      </div>
      <div className="w-full md:w-1/2 text-center md:text-left max-w-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          MAGE TRUMP TOKEN
        </h1>
        <p className="text-lg md:text-xl mb-2">
          Claim <span className="text-yellow-400 font-bold">$MAGE</span> Airdrop
        </p>
        <p className="mb-4 text-white/90">
          Connect your wallet to receive 0.5 SOL, locked until launch on April 27
        </p>
        <button
          onClick={handleConnect}
          className={`${
            connected ? 'bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 mb-4`}
        >
          {connected ? 'Wallet Connected' : 'Connect Wallet'}
        </button>

        {connected && (
          <>
            <p className="text-sm text-white/70 mb-1">Your referral link:</p>
            <div
              className="bg-white text-black px-4 py-2 rounded-xl mt-1 break-all cursor-pointer hover:bg-gray-100 transition"
              onClick={copyLink}
            >
              {refLink}
            </div>
            {copied && <p className="text-green-300 mt-1 text-sm">Link copied!</p>}

            <div className="mt-6">
              <p className="text-white/80">⏳ Claim available in:</p>
              <p className="text-xl font-bold text-yellow-300 mt-1">{countdown}</p>
              <button
                disabled
                className="mt-4 bg-gray-600 cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg opacity-70"
              >
                Claim (available April 27)
              </button>
            </div>
          </>
        )}

        {!connected && (
          <div className="mt-4 text-red-300">
            ❌ Connect your wallet to see your airdrop link and eligibility.
          </div>
        )}
      </div>
    </div>
  );
};

export default Airdrop;
