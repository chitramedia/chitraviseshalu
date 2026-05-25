"use client";

export default function MovieCardSkeleton() {
  return (
    <div className="min-w-[220px] bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden animate-pulse">
      {/* Poster area */}
      <div className="relative w-full h-[330px] bg-zinc-800/50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
      </div>
      
      {/* Rating badge placeholder */}
      <div className="absolute top-3 right-3 w-14 h-6 bg-zinc-800/70 rounded-full"></div>

      {/* Content wrapper */}
      <div className="p-5 w-full space-y-3">
        {/* Title line */}
        <div className="h-4 bg-zinc-800/60 rounded w-4/5"></div>
        {/* Date line */}
        <div className="h-3 bg-zinc-800/40 rounded w-1/2"></div>
      </div>
    </div>
  );
}
