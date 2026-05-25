import NewsCardSkeleton from "../components/skeletons/NewsCardSkeleton";

export default function NewsLoading() {
  return (
    <main className="min-h-screen bg-[#111111] text-white px-4 md:px-6 pt-28 pb-16 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="h-4 bg-zinc-800/40 rounded w-28 mx-auto"></div>
          <div className="h-10 md:h-14 bg-zinc-800/75 rounded-2xl w-2/3 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/40 rounded w-5/6 mx-auto"></div>
          </div>
        </header>

        {/* Category Pills Skeleton */}
        <div className="flex flex-wrap justify-center gap-2.5 pb-2">
          {["All News", "Tollywood", "Bollywood", "Hollywood", "OTT Releases", "Reviews", "Box Office"].map((filter) => (
            <div
              key={filter}
              className="px-4 py-2 bg-zinc-950/40 border border-zinc-900 rounded-full h-9 w-24 bg-zinc-800/50"
            ></div>
          ))}
        </div>

        {/* Grid Feed Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <NewsCardSkeleton key={item} />
          ))}
        </section>
      </div>
    </main>
  );
}
