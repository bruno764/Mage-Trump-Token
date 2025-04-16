import React from 'react';
import { Link } from 'react-router-dom';
import trumpImage from '../assets/front.png';
import TelegramPromo from '../components/TelegramPromo';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a369d] text-white flex flex-col">
      <header className="w-full flex flex-wrap justify-between items-center px-6 py-6">
        <div className="flex gap-6 flex-wrap text-white font-semibold text-sm">
          <Link to="/" className="hover:underline">HOME</Link>
          <Link to="/about" className="hover:underline text-yellow-300">ABOUT</Link>
          <Link to="/airdrop" className="hover:underline">AIRDROP</Link>
          <Link to="/referrals" className="hover:underline">REFERRALS</Link>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-center flex-grow px-6 py-10 gap-10">
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md flex justify-center">
          <img src={trumpImage} alt="Trump Mage" className="w-64 md:w-[320px] lg:w-[380px]" />
        </div>

        <div className="w-full lg:w-1/2 max-w-xl text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">🧙‍♂️ The Legend of Mage Trump</h1>

          <p className="mb-4 text-white/90">
            In an alternate crypto universe, Donald Trump was not a president… he was a **Mage** — a supreme wizard of memes, markets, and mystery.
          </p>

          <p className="mb-4 text-white/90">
            Born from rebellion, the <strong>Mage Trump Token ($MAGE)</strong> is not just a meme — it's a movement. Built on Solana, driven by the community, and fueled by humor and rewards.
          </p>

          <p className="mb-4 text-white/90">
            You earn <span className="text-yellow-300 font-semibold">0.5 SOL</span> just by connecting your wallet. Recruit new wizards with your referral link and earn even more.
          </p>

          <p className="mb-4 text-white/90">
            The Mage Council (admin panel) controls airdrops, balance, and claim power — only the chosen ones will rise.
          </p>

          <p className="mb-4 text-white/90">
            Share the prophecy. Join the Telegram bot. Spread the token of chaos and charisma.
          </p>

          <p className="text-sm text-white/60 mt-6 italic">
            “The memecoin revolution shall not be centralized.” — Mage Trump
          </p>
        </div>
      </main>

      {/* Promoção do bot Telegram */}
      <TelegramPromo />
    </div>
  );
}
