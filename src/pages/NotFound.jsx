import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <p className="text-lg mb-6 text-gray-300">Oops! The page you’re looking for doesn’t exist.</p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
