export default function MovieDetailLoading() {
  return (
    <main className="min-h-screen bg-[#111111] text-white pb-12 animate-pulse">
      {/* Backdrop skeleton */}
      <div className="relative h-[65vh] overflow-hidden bg-zinc-900/60">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent"></div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative -mt-64 z-10 space-y-6">
        {/* Back button */}
        <div className="w-20 h-8 bg-zinc-800/60 rounded-full"></div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-[320px_1fr] gap-8 md:gap-12 mt-6">
          {/* Left Column: Poster & OTT */}
          <div className="space-y-6">
            {/* Poster placeholder */}
            <div className="w-full aspect-[2/3] bg-zinc-900 border border-zinc-850 rounded-3xl"></div>
            {/* OTT Box */}
            <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-5 space-y-4">
              <div className="h-3 bg-zinc-800/40 rounded w-2/3"></div>
              <div className="h-10 bg-zinc-800/50 rounded-xl w-full"></div>
            </div>
          </div>

          {/* Right Column: Title, overview, stats */}
          <div className="space-y-8">
            <div className="space-y-4">
              {/* Category tag */}
              <div className="flex gap-2">
                <div className="w-24 h-5 bg-zinc-800/60 rounded"></div>
                <div className="w-16 h-5 bg-zinc-800/45 rounded"></div>
              </div>
              {/* Title */}
              <div className="h-10 md:h-14 bg-zinc-800/80 rounded-2xl w-3/4"></div>
              {/* Tagline */}
              <div className="h-5 bg-zinc-800/50 rounded w-1/2"></div>
              {/* Description */}
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
                <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
                <div className="h-4 bg-zinc-800/30 rounded w-4/5"></div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex gap-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="w-20 h-8 bg-zinc-800/55 rounded-xl"></div>
              ))}
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-[#1A1A1A] border border-zinc-800/30 p-4 rounded-2xl space-y-2">
                  <div className="h-3 bg-zinc-800/40 rounded w-12"></div>
                  <div className="h-5 bg-zinc-800/75 rounded w-16"></div>
                </div>
              ))}
            </div>

            {/* Box Office Statistics Panel */}
            <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-5 md:p-6 space-y-4">
              <div className="h-4 bg-zinc-800/60 rounded w-1/3"></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="h-3 bg-zinc-800/40 rounded w-20"></div>
                  <div className="h-4 bg-zinc-800/70 rounded w-28"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-zinc-800/40 rounded w-20"></div>
                  <div className="h-4 bg-zinc-800/70 rounded w-28"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
