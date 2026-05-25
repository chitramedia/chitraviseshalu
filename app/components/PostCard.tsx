"use client";

import Link from "next/link";

export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  image_url?: string;
  category: string;
  platform: string;
  release_date?: string;
  streaming_url?: string;
  author_id?: string;
}

export default function PostCard({ post }: { post: Post }) {
  // Simple map to color-code platform badges dynamically
  const platformColors: Record<string, string> = {
    Netflix: "bg-red-950/80 text-red-400 border-red-800/60",
    "Prime Video": "bg-blue-950/80 text-blue-400 border-blue-800/60",
    Aha: "bg-orange-950/80 text-orange-400 border-orange-800/60",
    Hotstar: "bg-cyan-950/80 text-cyan-400 border-cyan-800/60",
    Theaters: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
  };

  const badgeStyle =
    platformColors[post.platform] || "bg-zinc-850/80 text-zinc-300 border-zinc-700/60";

  return (
    <div className="relative flex flex-col bg-[#1A1A1A]/80 hover:bg-[#222222]/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/60 hover:border-zinc-700/80 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-300 group">
      {/* Thumbnail Aspect Ratio Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <img
          src={
            post.image_url ||
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000"
          }
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-md text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-gray-200 tracking-wider border border-zinc-800/40 z-20">
          {post.category}
        </span>
      </div>

      {/* Content wrapper */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border relative z-20 ${badgeStyle}`}
          >
            {post.platform}
          </span>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider relative z-20">
            {new Date(post.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-zinc-100 group-hover:text-red-500 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link
            href={`/news/${post.slug || post.id}`}
            className="focus:outline-none after:absolute after:inset-0 after:z-10"
          >
            {post.title}
          </Link>
        </h3>

        <p className="text-zinc-400 text-xs line-clamp-2 mb-4 flex-1 leading-relaxed relative z-25">
          {post.summary || post.content}
        </p>

        {post.platform !== "Theaters" && post.streaming_url && (
          <a
            href={post.streaming_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto block text-center bg-[#111111] hover:bg-red-650 border border-zinc-800 hover:border-red-600/50 text-[11px] font-bold uppercase tracking-wider py-2 rounded-xl transition-all duration-300 text-zinc-350 hover:text-white relative z-20"
          >
            Stream Now
          </a>
        )}
      </div>
    </div>
  );
}
