"use client";

export default function RecommendationSkeleton() {
  return (
    <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 md:p-8 grid md:grid-cols-[200px_1fr] gap-8 animate-pulse shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Poster skeleton */}
      <div className="w-full aspect-[2/3] bg-zinc-900 rounded-2xl"></div>

      {/* Details & explanation skeleton */}
      <div className="flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            {/* Title */}
            <div className="h-7 bg-zinc-800/80 rounded w-2/3"></div>
            {/* Meta (release date/rating) */}
            <div className="h-4 bg-zinc-800/40 rounded w-1/3"></div>
          </div>
          
          {/* Overview text lines */}
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
            <div className="h-4 bg-zinc-800/30 rounded w-5/6"></div>
          </div>
        </div>

        {/* AI Insight Box placeholder */}
        <div className="border border-zinc-800/30 bg-[#111111]/40 rounded-2xl p-5 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[3px] h-full bg-zinc-800"></div>
          <div className="h-3 bg-zinc-800/60 rounded w-24"></div>
          <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
          <div className="h-4 bg-zinc-800/30 rounded w-2/3"></div>
        </div>

        {/* Button placeholder */}
        <div className="w-28 h-10 bg-zinc-850/60 rounded-xl"></div>
      </div>
    </div>
  );
}
