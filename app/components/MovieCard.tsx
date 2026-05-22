import React from 'react';

interface MovieCardProps {
  title: string;
  category: string;
}

export default function MovieCard({ title, category }: MovieCardProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition duration-300 group flex flex-col">
      {/* Aspect-ratio layout box for future TMDB posters */}
      <div className="aspect-[2/3] w-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500 border-b border-zinc-800 uppercase tracking-widest select-none">
        Poster
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xl font-semibold mb-2 group-hover:text-red-500 transition line-clamp-1">
            {title}
          </h4>
          <p className="text-zinc-400 text-sm">
            {category}
          </p>
        </div>

        <button className="mt-5 text-red-500 text-sm hover:text-red-400 text-left flex items-center gap-1 group/btn">
          Read Review 
          <span className="transform group-hover/btn:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}