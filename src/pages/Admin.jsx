import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [totalSol, setTotalSol] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const { publicKey, disconnect } = useWallet();
  const walletAddress = publicKey?.toBase58();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const userSnap = await getDocs(collection(db, 'users'));
      const usersData = userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      setTotalSol(usersData.reduce((total, user) => total + parseFloat(user.balance || 0), 0));

      const txSnap = await getDocs(collection(db, 'transactions'));
      const txData = txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(txData.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds));
    };

    if (walletAddress === '4SCGGaB8RFKGi1pQXZ71vejUehvrZW5taoGMToqCcKUD') {
      loadData();
    } else {
      navigate('/login');
    }
  }, [walletAddress, navigate]);

  const toggleClaim = async (userId, currentState) => {
    try {
      await updateDoc(doc(db, 'users', userId), { canClaim: !currentState });
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, canClaim: !currentState } : user
        )
      );
    } catch (err) {
      console.error('Error toggling claim:', err);
    }
  };

  const enableAllClaims = async () => {
    try {
      const batch = await getDocs(collection(db, 'users'));
      const updates = batch.docs.map(docSnap =>
        updateDoc(doc(db, 'users', docSnap.id), { canClaim: true })
      );
      await Promise.all(updates);
      setUsers(prev => prev.map(user => ({ ...user, canClaim: true })));
    } catch (err) {
      console.error('Error enabling all claims:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div>
          <span className="text-sm mr-4">Connected: {walletAddress}</span>
          <button
            onClick={disconnect}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="grid grid-cols-2 gap-4 w-full md:w-1/2">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl mt-2">{users.length}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-semibold">Total Balance (SOL)</h2>
            <p className="text-3xl mt-2">{totalSol.toFixed(2)} SOL</p>
          </div>
        </div>
        <button
          onClick={enableAllClaims}
          className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded h-max"
        >
          Enable Claim for All
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto mb-8">
        <h2 className="text-xl font-semibold mb-2">User List</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">Wallet</th>
              <th className="p-2">Referral</th>
              <th className="p-2">Balance</th>
              <th className="p-2">Claimed</th>
              <th className="p-2">Claim Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-700">
                <td className="p-2">{user.wallet}</td>
                <td className="p-2">{user.referral || '-'}</td>
                <td className="p-2">{user.balance || '0.000'}</td>
                <td className="p-2">{user.claimed ? '✅' : '❌'}</td>
                <td className="p-2">{user.canClaim ? '✅' : '❌'}</td>
                <td className="p-2">{user.createdAt?.toDate?.().toLocaleString() || '-'}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleClaim(user.id, user.canClaim)}
                    className={`${
                      user.canClaim ? 'bg-gray-600 hover:bg-gray-700' : 'bg-yellow-500 hover:bg-yellow-600'
                    } text-white px-3 py-1 rounded text-xs`}
                  >
                    {user.canClaim ? 'Disable Claim' : 'Enable Claim'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-t border-gray-700">
                <td className="p-2">{tx.from}</td>
                <td className="p-2">{tx.to}</td>
                <td className="p-2">{tx.amount}</td>
                <td className="p-2">{tx.timestamp?.toDate?.().toLocaleString() || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}