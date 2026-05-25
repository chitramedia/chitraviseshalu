"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNewsArticles, NewsArticle } from "../lib/newsData";

export default function HomeNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    getNewsArticles().then(data => setArticles(data.slice(0, 3)));
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-red-500 text-xs uppercase tracking-widest font-bold block mb-1">
            ⚡ Cinema Gossip Drops
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Latest Industry Updates
          </h2>
        </div>
        <Link
          href="/news"
          className="text-zinc-400 hover:text-white transition text-xs font-bold uppercase tracking-wider bg-zinc-950 border border-zinc-900 px-4 py-2.5 rounded-xl"
        >
          View All updates →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {articles.map((article) => {
          // Format date to local readable text
          const timeString = new Date(article.publishedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });

          return (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group flex flex-col justify-between transition duration-300"
            >
              <div className="space-y-4">
                {/* News Image */}
                <div className="relative h-56 overflow-hidden rounded-2xl bg-zinc-900 transition duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 left-3 bg-[#111111]/85 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white transition leading-snug group-hover:text-zinc-300">
                    {article.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-4 border-t border-zinc-800/40 mt-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span>{article.author.avatar}</span>
                  <span>{article.author.name}</span>
                </div>
                <span>📅 {timeString}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
