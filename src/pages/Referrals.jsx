import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import trumpImage from '../assets/front.png';
import TelegramPromo from '../components/TelegramPromo';

export default function Referrals() {
  const { publicKey, connected } = useWallet();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const walletAddress = publicKey?.toBase58();

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!walletAddress) return;

      try {
        const q = query(collection(db, 'users'), where('referral', '==', walletAddress));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data());
        setReferrals(data);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [walletAddress]);

  const formatDate = (date) => {
    try {
      if (!date) return 'Invalid Date';
      const parsedDate = typeof date === 'string'
        ? new Date(date)
        : date.toDate?.() || new Date(date);
      return parsedDate.toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const exportToCSV = () => {
    const csvRows = [['Wallet', 'Created At'], ...referrals.map(r => [r.wallet, formatDate(r.createdAt)])];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'referrals.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col">
      <header className="w-full flex flex-wrap justify-between items-center px-6 py-6">
        <div className="flex gap-6 flex-wrap text-white font-semibold text-sm">
          <Link to="/" className="hover:underline">HOME</Link>
          <Link to="/about" className="hover:underline">ABOUT</Link>
          <Link to="/airdrop" className="hover:underline">AIRDROP</Link>
          <Link to="/referrals" className="hover:underline text-yellow-300">REFERRALS</Link>
        </div>
        <div className="text-sm text-white/80 mt-4 md:mt-0">
          {connected ? `Connected: ${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-4)}` : 'Not connected'}
        </div>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center flex-grow px-6 py-10 gap-10">
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md flex justify-center">
          <img src={trumpImage} alt="Trump Mage" className="w-64 md:w-[320px] lg:w-[380px]" />
        </div>

        <div className="w-full lg:w-1/2 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">Your Mage Recruits</h1>

          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : referrals.length === 0 ? (
            <p className="text-white/70">No one has joined your army yet. Share your referral link and start summoning allies to earn more!</p>
          ) : (
            <div className="mt-4 bg-white text-black rounded-md p-4 max-h-64 overflow-y-auto shadow-lg">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 border-b">Wallet</th>
                    <th className="pb-2 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((ref, index) => (
                    <tr key={index}>
                      <td className="py-1 break-all">{ref.wallet}</td>
                      <td className="py-1">{formatDate(ref.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {referrals.length > 0 && (
            <button
              onClick={exportToCSV}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Download Your Recruit List
            </button>
          )}
        </div>
      </main>

      {/* Promoção do bot Telegram */}
      <TelegramPromo />
    </div>
  );
}
