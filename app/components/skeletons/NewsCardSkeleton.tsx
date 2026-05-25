"use client";

export default function NewsCardSkeleton() {
  return (
    <div className="flex flex-col bg-[#1A1A1A]/80 border border-zinc-800/60 rounded-2xl overflow-hidden animate-pulse">
      {/* Thumbnail aspect-video placeholder */}
      <div className="aspect-video w-full bg-zinc-900/90 relative">
        {/* Category badge slot */}
        <div className="absolute top-3 left-3 w-16 h-5 bg-zinc-800/70 rounded-md"></div>
      </div>

      {/* Content wrapper */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="w-20 h-5 bg-zinc-800/60 rounded-full"></div>
          <div className="w-16 h-3 bg-zinc-800/40 rounded"></div>
        </div>

        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800/70 rounded w-full"></div>
          <div className="h-4 bg-zinc-800/70 rounded w-5/6"></div>
        </div>

        {/* Summary text lines */}
        <div className="space-y-2 flex-1 pt-1">
          <div className="h-3 bg-zinc-800/40 rounded w-full"></div>
          <div className="h-3 bg-zinc-800/40 rounded w-4/5"></div>
        </div>

        {/* Streaming button placeholder */}
        <div className="w-full h-8 bg-zinc-800/60 rounded-xl mt-2"></div>
      </div>
    </div>
  );
}
