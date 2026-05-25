import RecommendationSkeleton from "../components/skeletons/RecommendationSkeleton";

export default function RecommendationsLoading() {
  return (
    <main className="min-h-screen bg-[#111111] text-white px-6 pt-28 pb-16 animate-pulse">
      <div className="max-w-7xl w-full mx-auto space-y-12">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-zinc-800/40 pb-8">
          <div className="space-y-3">
            <div className="h-10 md:h-14 bg-zinc-800/75 rounded-2xl w-60"></div>
            <div className="h-4 bg-zinc-800/40 rounded w-80"></div>
          </div>
          <div className="w-40 h-8 bg-zinc-800/50 rounded-full"></div>
        </div>

        {/* Content list skeleton */}
        <div className="space-y-12">
          <RecommendationSkeleton />
          <RecommendationSkeleton />
        </div>
      </div>
    </main>
  );
}
