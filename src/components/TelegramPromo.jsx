import React from 'react';

export default function TelegramPromo() {
  return (
    <div className="bg-blue-900 rounded-xl p-4 text-white mt-10 text-center shadow-lg">
      <p className="text-lg font-semibold">🤖 Join the official MageTrump Bot and get notified of your rewards!</p>
      <a
        href="https://t.me/mage_trump_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 bg-yellow-400 text-black px-5 py-2 rounded-lg font-bold hover:bg-yellow-300 transition"
      >
        👉 Join @mage_trump_bot
      </a>
    </div>
  );
}
