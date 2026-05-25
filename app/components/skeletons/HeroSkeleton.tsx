"use client";

export default function HeroSkeleton() {
  return (
    <div className="relative w-full h-screen flex items-end pb-24 overflow-hidden bg-zinc-950/60 animate-pulse">
      {/* Background placeholder */}
      <div className="absolute inset-0 bg-zinc-900/80"></div>
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/0 via-[#111111]/40 to-[#111111] z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 via-[#111111]/20 to-transparent z-10 pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-8 space-y-6">
        {/* Tag line */}
        <div className="h-4 bg-zinc-800/60 rounded w-40"></div>
        
        {/* Title block */}
        <div className="space-y-3 max-w-2xl">
          <div className="h-10 md:h-16 bg-zinc-800/80 rounded-2xl w-3/4"></div>
          <div className="h-10 md:h-16 bg-zinc-800/80 rounded-2xl w-1/2"></div>
        </div>

        {/* Description block */}
        <div className="space-y-2 max-w-xl">
          <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
          <div className="h-4 bg-zinc-800/40 rounded w-5/6"></div>
        </div>

        {/* Button rows */}
        <div className="flex gap-4 pt-4">
          <div className="w-36 h-12 bg-zinc-800/80 rounded-full"></div>
          <div className="w-36 h-12 bg-zinc-800/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
