import HeroSkeleton from "./components/skeletons/HeroSkeleton";
import MovieCardSkeleton from "./components/skeletons/MovieCardSkeleton";
import NewsCardSkeleton from "./components/skeletons/NewsCardSkeleton";
import ReviewSkeleton from "./components/skeletons/ReviewSkeleton";

export default function RootLoading() {
  return (
    <main className="bg-[#111111] text-white min-h-screen relative animate-pulse">
      {/* Navbar skeleton */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#111111]/80 border-b border-zinc-900 z-50"></div>

      <HeroSkeleton />

      <div className="bg-[#111111] relative z-20 space-y-16 py-16">
        {/* Community Poll Skeleton */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="h-4 bg-zinc-800/40 rounded w-24"></div>
            <div className="h-6 bg-zinc-800/70 rounded w-2/3 md:w-1/2"></div>
            <div className="space-y-3 pt-2">
              <div className="w-full h-11 bg-zinc-900/80 border border-zinc-800/60 rounded-xl"></div>
              <div className="w-full h-11 bg-zinc-900/80 border border-zinc-800/60 rounded-xl"></div>
            </div>
          </div>
        </section>

        {/* Trending Section Row */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="h-4 bg-zinc-800/40 rounded w-24"></div>
              <div className="h-7 bg-zinc-800/75 rounded w-48"></div>
            </div>
            <div className="w-24 h-8 bg-zinc-900/85 rounded-xl"></div>
          </div>
          <div className="flex gap-6 overflow-x-hidden pb-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <MovieCardSkeleton key={item} />
            ))}
          </div>
        </section>

        {/* News Feed Grid */}
        <section className="max-w-7xl mx-auto px-6 py-4">
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-zinc-800/40 rounded w-24"></div>
            <div className="h-7 bg-zinc-800/75 rounded w-60"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <NewsCardSkeleton key={item} />
            ))}
          </div>
        </section>

        {/* Community Reviews Section */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="h-4 bg-zinc-800/40 rounded w-24"></div>
              <div className="h-7 bg-zinc-800/75 rounded w-52"></div>
            </div>
            <div className="w-28 h-9 bg-zinc-900/85 rounded-xl"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <ReviewSkeleton />
            <ReviewSkeleton />
          </div>
        </section>
      </div>
    </main>
  );
}