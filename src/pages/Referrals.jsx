import React, { useEffect, useState, useContext } from 'react';
import { WalletContext } from '../wallet/PhantomProvider';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Referral() {
  const { walletAddress } = useContext(WalletContext);
  const [referrals, setReferrals] = useState([]);
  const [totalReferralSOL, setTotalReferralSOL] = useState(0);

  useEffect(() => {
    if (walletAddress) {
      fetchReferrals();
    }
  }, [walletAddress]);

  const fetchReferrals = async () => {
    const q = query(collection(db, 'users'), where('referral', '==', walletAddress));
    const snapshot = await getDocs(q);
    const referralsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReferrals(referralsList);

    // Somar a recompensa fictícia de 0.1 SOL para cada novo usuário referenciado
    setTotalReferralSOL(referralsList.length * 0.1);
  };

  return (
    <div className="min-h-screen bg-[#0a369d] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Referral Program</h1>

      <div className="max-w-5xl mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>
        <div className="mb-4">
          <p>Your wallet address: {walletAddress}</p>
          <p>Total earnings from referrals: {totalReferralSOL} SOL (fictitious)</p>
        </div>

        <h3 className="text-lg font-medium">People who signed up using your referral link:</h3>
        <ul className="list-disc pl-5">
          {referrals.map(referral => (
            <li key={referral.id}>
              Wallet: {referral.wallet}, Date: {new Date(referral.createdAt.seconds * 1000).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
