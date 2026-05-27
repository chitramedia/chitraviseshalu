import MovieCardSkeleton from "../components/skeletons/MovieCardSkeleton";

export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-[#111111] text-white px-6 pt-28 pb-16 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back button */}
        <div className="w-20 h-8 bg-zinc-800/60 rounded-full"></div>

        {/* Hero */}
        <div className="mb-14 text-center mt-6 space-y-4">
          <div className="h-4 bg-zinc-800/40 rounded w-24 mx-auto"></div>
          <div className="h-10 md:h-12 bg-zinc-800/75 rounded-2xl w-80 mx-auto"></div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/40 rounded w-5/6 mx-auto"></div>
          </div>
        </div>

        {/* Search bar placeholder */}
        <div className="mb-14 max-w-3xl mx-auto h-12 bg-zinc-900/90 border border-zinc-800/60 rounded-xl"></div>

        {/* Shimmer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 8].map((item) => (
            <div key={item} className="flex flex-col space-y-3">
              <div className="relative bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl overflow-hidden aspect-[2/3]">
                <div className="absolute inset-0 bg-zinc-800/50"></div>
                <div className="absolute top-3 right-3 w-12 h-6 bg-zinc-800/80 rounded-full"></div>
                <div className="absolute bottom-5 left-5 right-5 space-y-2">
                  <div className="h-4 bg-zinc-850 rounded w-3/4"></div>
                  <div className="h-3 bg-zinc-850 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
