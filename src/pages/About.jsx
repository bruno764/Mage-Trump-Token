import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import trumpImage from '../assets/front.png';
import TelegramPromo from '../components/TelegramPromo';

export default function About() {
  const [totalWallets, setTotalWallets] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => doc.data());

      setTotalWallets(users.length);

      const referralsCount = users.filter(user => user.referral).length;
      setTotalReferrals(referralsCount);
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col">
      <header className="w-full flex flex-wrap justify-between items-center px-6 py-6">
        <div className="flex gap-6 flex-wrap text-white font-semibold text-sm">
          <Link to="/" className="hover:underline">HOME</Link>
          <Link to="/about" className="hover:underline text-yellow-300">ABOUT</Link>
          <Link to="/airdrop" className="hover:underline">AIRDROP</Link>
          <Link to="/referrals" className="hover:underline">REFERALS</Link>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center flex-grow px-6 py-10 gap-10">
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md flex justify-center">
          <img src={trumpImage} alt="Trump Mage" className="w-64 md:w-[320px] lg:w-[380px]" />
        </div>

        <div className="w-full lg:w-1/2 max-w-xl text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">📊 Community Stats</h1>

          <div className="bg-white/10 border border-white/20 p-6 rounded-xl w-full shadow-lg">
            <p className="text-xl mb-4">
              👥 <span className="font-bold text-yellow-400">{totalWallets}</span> wallets registered
            </p>
            <p className="text-xl">
              🧙‍♂️ <span className="font-bold text-green-400">{totalReferrals}</span> users joined by referral
            </p>
          </div>

          <p className="text-sm mt-6 text-white/60">Updated in real time from Firestore 🔥</p>
        </div>
      </main>

      {/* Promoção do bot Telegram */}
      <TelegramPromo />
    </div>
  );
}
