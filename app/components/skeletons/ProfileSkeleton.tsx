"use client";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-pulse">
      {/* Back button placeholder */}
      <div className="w-20 h-8 bg-zinc-800/60 rounded-full"></div>

      {/* Main Profile Info Card */}
      <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar block */}
          <div className="w-24 h-24 rounded-3xl bg-zinc-800 flex-shrink-0"></div>

          {/* Name & Bio block */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
              <div className="h-8 bg-zinc-800/80 rounded w-44"></div>
              <div className="h-6 bg-zinc-800/40 rounded-full w-24"></div>
            </div>
            <div className="h-4 bg-zinc-800/50 rounded w-32 mx-auto md:mx-0"></div>
            <div className="space-y-2 max-w-2xl">
              <div className="h-4 bg-zinc-855/40 rounded w-full"></div>
              <div className="h-4 bg-zinc-855/40 rounded w-5/6"></div>
            </div>
          </div>
        </div>

        {/* Profile Statistics Grid */}
        <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/40 mt-8 pt-6 text-center">
          <div className="py-2 border-r border-zinc-800/40 space-y-2">
            <div className="h-3 bg-zinc-800/45 rounded w-16 mx-auto"></div>
            <div className="h-6 bg-zinc-800/70 rounded w-8 mx-auto"></div>
          </div>
          <div className="py-2 border-r border-zinc-800/40 space-y-2">
            <div className="h-3 bg-zinc-800/45 rounded w-16 mx-auto"></div>
            <div className="h-6 bg-zinc-800/70 rounded w-8 mx-auto"></div>
          </div>
          <div className="py-2 space-y-2">
            <div className="h-3 bg-zinc-800/45 rounded w-16 mx-auto"></div>
            <div className="h-6 bg-zinc-800/70 rounded w-12 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Tabs & Listings placeholder */}
      <div className="space-y-6">
        <div className="flex border-b border-zinc-850 gap-6 pb-3">
          <div className="w-24 h-5 bg-zinc-800/60 rounded"></div>
          <div className="w-28 h-5 bg-zinc-800/40 rounded"></div>
          <div className="w-24 h-5 bg-zinc-800/40 rounded"></div>
        </div>
        
        {/* Watchlist grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl overflow-hidden space-y-3 pb-3">
              <div className="w-full h-64 bg-zinc-900"></div>
              <div className="px-3.5 space-y-2">
                <div className="h-4 bg-zinc-800/60 rounded w-3/4"></div>
                <div className="h-7 bg-zinc-800/40 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
