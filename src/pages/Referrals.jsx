import React, { useEffect, useState } from 'react';
import trumpImage from '../assets/front.png';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => doc.data());
      const validReferrals = data.filter(user => user.referral);
      setReferrals(validReferrals);
    };
    fetchReferrals();
  }, []);

  const exportCSV = () => {
    const csvHeader = 'Wallet,Referral,Date\n';
    const csvRows = referrals.map(r =>
      `${r.wallet},${r.referral || ''},${r.createdAt || ''}`
    );
    const csvContent = csvHeader + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'referrals.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col md:flex-row items-center justify-center p-6">
      <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
        <img src={trumpImage} alt="Trump" className="w-72 md:w-[450px]" />
      </div>

      <div className="w-full md:w-1/2 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center md:text-left">
          Referrals Overview
        </h1>
        <p className="text-white/80 mb-4 text-center md:text-left">
          Below are all users who joined through a referral link.
        </p>

        <div className="bg-white text-black rounded-lg shadow-md overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Wallet</th>
                <th className="px-4 py-2 text-left">Referral</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((user, i) => (
                <tr key={i} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 break-all">{user.wallet}</td>
                  <td className="px-4 py-2 break-all">{user.referral || '-'}</td>
                  <td className="px-4 py-2">{user.createdAt?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center md:text-left">
          <button
            onClick={exportCSV}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
