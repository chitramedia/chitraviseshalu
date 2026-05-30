"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function WatchlistBottomNav() {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 inset-x-0 mx-auto max-w-md px-4 z-50">
      <nav className="bg-neutral-900/90 backdrop-blur-lg border border-neutral-850 rounded-2xl px-3 py-2 flex justify-between items-center shadow-2xl shadow-black">
        {['Home', 'Discover', 'Battles', 'Challenge', 'Watchlist'].map((tab) => {
          const isTabActive = tab === 'Watchlist';
          return (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'Watchlist') {
                  // Already on watchlist page
                  return;
                } else if (tab === 'Home') {
                  router.push('/');
                } else {
                  router.push(`/?tab=${tab.toLowerCase()}`);
                }
              }}
              className={`px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 cursor-pointer ${
                isTabActive
                  ? 'bg-amber-500 text-black scale-105 shadow-md shadow-amber-500/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
