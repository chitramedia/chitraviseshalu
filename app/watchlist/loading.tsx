export default function WatchlistLoading() {
  return (
    <main className="min-h-screen bg-[#111111] text-white px-6 pt-28 pb-16 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back button placeholder */}
        <div className="w-20 h-8 bg-zinc-800/60 rounded-full"></div>

        {/* Title placeholder */}
        <div className="h-10 md:h-14 bg-zinc-800/75 rounded-2xl w-48 mt-6"></div>

        {/* Watchlist Movie grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div key={item} className="flex flex-col space-y-3">
              {/* Poster frame */}
              <div className="aspect-[2/3] w-full bg-[#1A1A1A] rounded-2xl"></div>
              {/* Title line */}
              <div className="h-4 bg-zinc-800/60 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800/40 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
