"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNewsArticles, NewsArticle } from "../lib/newsData";

export default function HomeNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    setArticles(getNewsArticles().slice(0, 3));
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

      <div className="grid md:grid-cols-3 gap-6">
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
              className="group bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 rounded-3xl p-5 hover:-translate-y-1.5 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* News Image */}
                <div className="relative h-44 overflow-hidden rounded-2xl border border-zinc-900">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-red-650/90 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-white group-hover:text-red-500 transition line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-4 border-t border-zinc-900/60 mt-4 font-semibold">
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
