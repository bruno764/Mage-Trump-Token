import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import trumpImage from '../assets/front.png';

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
        console.error('Erro ao buscar referências:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [walletAddress]);

  const exportToCSV = () => {
    const csvRows = [
      ['Wallet', 'Created At'],
      ...referrals.map(r => [r.wallet, r.createdAt]),
    ];
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
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col items-center justify-between">
      <header className="w-full flex justify-between items-center px-10 py-6">
        <div className="flex gap-10 text-white font-semibold text-sm">
          <Link to="/" className="hover:underline">HOME</Link>
          <Link to="/about" className="hover:underline">ABOUT</Link>
          <Link to="/roadmap" className="hover:underline">ROADMAP</Link>
          <Link to="/airdrop">AIRDROP</Link>
          <Link to="/referrals" className="hover:underline text-yellow-300">REFERALS</Link>
        </div>
        <div className="text-sm text-white/80">
          {connected ? `Connected: ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Not connected'}
        </div>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-center flex-grow px-4 py-8 w-full text-center md:text-left">
        <div className="w-full md:w-1/2 flex justify-center">
          <img src={trumpImage} alt="Trump Mage" className="w-64 md:w-[320px] lg:w-[380px]" />
        </div>

        <div className="w-full md:w-1/2 mt-6 md:mt-0 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Referrals</h1>

          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : referrals.length === 0 ? (
            <p className="text-white/70">No referrals yet.</p>
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
                      <td className="py-1">{new Date(ref.createdAt).toLocaleString()}</td>
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
              Export to CSV
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
