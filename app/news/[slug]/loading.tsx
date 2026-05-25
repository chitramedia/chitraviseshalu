export default function NewsArticleDetailLoading() {
  return (
    <main className="min-h-screen bg-[#111111] text-white px-4 md:px-6 pt-28 pb-16 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation / Action bar */}
        <div className="flex justify-between items-center">
          <div className="w-20 h-8 bg-zinc-800/60 rounded-full"></div>
          <div className="flex gap-2">
            <div className="w-16 h-8 bg-zinc-800/40 rounded-full"></div>
            <div className="w-24 h-8 bg-zinc-800/40 rounded-full"></div>
          </div>
        </div>

        {/* Banner Area */}
        <div className="relative h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-850">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="h-5 bg-zinc-800/75 rounded-md w-24"></div>
            <div className="h-8 md:h-12 bg-zinc-800/80 rounded-xl w-3/4"></div>
          </div>
        </div>

        {/* Author / Date Meta bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
            <div className="space-y-1">
              <div className="h-4 bg-zinc-800/70 rounded w-24"></div>
              <div className="h-2.5 bg-zinc-800/40 rounded w-16"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-20 h-4 bg-zinc-800/40 rounded"></div>
            <div className="w-16 h-4 bg-zinc-800/40 rounded"></div>
          </div>
        </div>

        {/* Paragraph content skeleton blocks */}
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800/50 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/50 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/40 rounded w-11/12"></div>
            <div className="h-4 bg-zinc-800/30 rounded w-4/5"></div>
          </div>
          
          <div className="h-6 bg-zinc-800/75 rounded w-1/3 pt-4"></div>

          <div className="space-y-2">
            <div className="h-4 bg-zinc-800/50 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/50 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/30 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
