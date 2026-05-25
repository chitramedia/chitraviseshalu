"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNewsArticles, NewsArticle } from "../lib/newsData";

export default function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    getNewsArticles().then(setArticles);
  }, []);

  const categories = ["All", "Tollywood", "Bollywood", "Hollywood", "OTT", "Box Office"];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === "All" || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center bg-[#1A1A1A] p-6 rounded-3xl border border-zinc-800/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition duration-300 ${
                activeCategory === category
                  ? "bg-white text-[#111111] shadow-md font-bold"
                  : "bg-[#111111]/80 text-zinc-400 hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111]/80 border border-zinc-800/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white transition duration-300"
          />
          <span className="absolute left-3 top-3.5 text-zinc-500">🔍</span>
        </div>
      </div>

      {/* Featured Headline */}
      {filteredArticles.length > 0 && searchQuery === "" && activeCategory === "All" && (
        <div className="group relative rounded-3xl overflow-hidden border border-zinc-800/30 bg-[#1A1A1A] hover:border-white/10 transition duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <Link href={`/news/${filteredArticles[0].id}`} className="grid md:grid-cols-2 gap-0 md:gap-6">
            <div className="relative h-64 md:h-[400px] overflow-hidden bg-zinc-900">
              <img
                src={filteredArticles[0].image}
                alt={filteredArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111111] via-[#111111]/45 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-white text-[#111111] font-bold text-xs uppercase px-3 py-1 rounded-md tracking-wider shadow-lg">
                🔥 Hot Update
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center space-y-4">
              <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                {filteredArticles[0].category} &bull; {filteredArticles[0].readTime}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white group-hover:text-zinc-300 transition duration-300 leading-tight">
                {filteredArticles[0].title}
              </h2>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                {filteredArticles[0].summary}
              </p>
              <div className="flex items-center gap-3 pt-4">
                <span className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-lg">
                  {filteredArticles[0].author.avatar}
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{filteredArticles[0].author.name}</div>
                  <div className="text-xs text-zinc-500">{filteredArticles[0].author.role}</div>
                </div>
                <div className="ml-auto text-xs text-zinc-500">
                  {new Date(filteredArticles[0].publishedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Grid of articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1A1A] rounded-3xl border border-zinc-800/30">
          <span className="text-5xl block mb-4">📰</span>
          <h3 className="text-2xl font-bold text-white mb-2">No News Found</h3>
          <p className="text-zinc-500 text-sm">We couldn't find any articles matching your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles
            .slice(searchQuery === "" && activeCategory === "All" ? 1 : 0)
            .map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between transition duration-300"
              >
                <div>
                  {/* News Image */}
                  <div className="relative h-48 overflow-hidden rounded-2xl bg-[#1A1A1A] transition duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-3 left-3 bg-[#111111]/85 text-white font-bold text-xs uppercase px-2.5 py-1 rounded-md tracking-wider border border-zinc-800/40 backdrop-blur-sm">
                      {article.category}
                    </div>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="text-xs text-zinc-500 flex justify-between">
                      <span>{article.readTime}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <Link href={`/news/${article.id}`}>
                      <h3 className="font-bold text-lg text-white group-hover:text-zinc-300 line-clamp-2 transition leading-snug">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/40 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] flex items-center justify-center text-sm">
                    {article.author.avatar}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-zinc-300">{article.author.name}</div>
                    <div className="text-[10px] text-zinc-500">{article.author.role}</div>
                  </div>
                  <Link
                    href={`/news/${article.id}`}
                    className="ml-auto text-xs text-white font-bold hover:text-zinc-300 flex items-center gap-1 transition"
                  >
                    Read More <span className="group-hover:translate-x-1 transition duration-200">➔</span>
                  </Link>
                </div>
              </article>
            ))}
        </div>
      )}
    </div>
  );
}
