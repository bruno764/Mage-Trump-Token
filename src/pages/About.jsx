import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">📊 Community Stats</h1>

      <div className="bg-white/10 border border-white/20 p-6 rounded-xl w-full max-w-md shadow-lg">
        <p className="text-xl mb-4">
          👥 <span className="font-bold text-yellow-400">{totalWallets}</span> wallets registered
        </p>
        <p className="text-xl">
          🧙‍♂️ <span className="font-bold text-green-400">{totalReferrals}</span> users joined by referral
        </p>
      </div>

      <p className="text-sm mt-6 text-white/60">Updated in real time from Firestore 🔥</p>
    </div>
  );
}
