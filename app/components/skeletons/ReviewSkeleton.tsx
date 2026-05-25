"use client";

export default function ReviewSkeleton() {
  return (
    <div className="block bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden animate-pulse space-y-4">
      {/* Header meta */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 flex-1">
          {/* Title line */}
          <div className="h-5 bg-zinc-800/60 rounded w-2/3"></div>
          {/* User line */}
          <div className="h-3 bg-zinc-800/40 rounded w-1/4"></div>
        </div>
        {/* Rating stars block */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-4 h-4 bg-zinc-800/50 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Review body paragraph */}
      <div className="space-y-2 pt-2">
        <div className="h-4 bg-zinc-800/40 rounded w-full"></div>
        <div className="h-4 bg-zinc-800/40 rounded w-11/12"></div>
        <div className="h-4 bg-zinc-800/30 rounded w-3/4"></div>
      </div>

      {/* Footer metadata */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60 mt-4">
        <div className="h-3 bg-zinc-800/40 rounded w-1/3"></div>
        <div className="h-3 bg-zinc-800/60 rounded w-1/4"></div>
      </div>
    </div>
  );
}
