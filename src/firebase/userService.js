
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./config";

export const registerUser = async (wallet, referredBy = null) => {
  const ref = doc(db, "users", wallet);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      wallet,
      referredBy,
      createdAt: new Date().toISOString(),
      balance: 0.5,
      referralCount: 0,
      referralBalance: 0,
      isUnlocked: false
    });
    if (referredBy) {
      const referrerDoc = doc(db, "users", referredBy);
      await updateDoc(referrerDoc, {
        referralCount: increment(1),
        referralBalance: increment(0.1)
      });
    }
  }
};
