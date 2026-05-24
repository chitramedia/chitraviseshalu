"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function RecommendationsPage() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your profile...");
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [engineSource, setEngineSource] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoadingUser(false);

      if (user) {
        fetchProfileAndRecommendations(user);
      }
    } catch (err) {
      console.error(err);
      setLoadingUser(false);
    }
  };

  const fetchProfileAndRecommendations = async (currUser: any) => {
    try {
      setLoadingRecs(true);
      setError("");
      
      // Fetch Watchlist
      const { data: watchlistData } = await supabase
        .from("watchlists")
        .select("*")
        .eq("user_id", currUser.id);

      // Fetch Reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_email", currUser.email);

      const wl = watchlistData || [];
      const rev = reviewsData || [];

      setWatchlist(wl);
      setReviews(rev);

      if (wl.length === 0 && rev.length === 0) {
        setLoadingRecs(false);
        return;
      }

      // Start loading messages cycle
      const messages = [
        "Analyzing your watchlist...",
        "Evaluating your movie reviews...",
        "Identifying your preferred genres...",
        "Consulting Gemini AI core...",
        "Drafting custom insights for you...",
      ];
      let msgIdx = 0;
      setLoadingMessage(messages[0]);
      const interval = setInterval(() => {
        msgIdx = (msgIdx + 1) % messages.length;
        setLoadingMessage(messages[msgIdx]);
      }, 1500);

      // Fetch from recommendations API
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ watchlist: wl, reviews: rev }),
      });

      clearInterval(interval);

      if (!res.ok) {
        throw new Error("Failed to load recommendations");
      }

      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setEngineSource(data.source || "");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoadingRecs(false);
    }
  };

  // Render Login CTA
  const renderLoginCTA = () => (
    <div className="text-center py-20 px-6 max-w-xl mx-auto">
      <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-800 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <span className="text-4xl">✨</span>
      </div>
      <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
        Unlock AI Recommendations
      </h2>
      <p className="text-zinc-400 mb-8 leading-relaxed">
        Let Gemini analyze your watchlists and movie reviews to curate a personalized cinema guide. Find your next favorite movie instantly.
      </p>
      <Link
        href="/login"
        className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-2xl transition duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
      >
        Sign in to Get Started
      </Link>
    </div>
  );

  // Render Empty Taste Profile
  const renderEmptyProfile = () => (
    <div className="text-center py-20 px-6 max-w-xl mx-auto">
      <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-zinc-800">
        <span className="text-4xl">🍿</span>
      </div>
      <h2 className="text-3xl font-extrabold mb-4 text-white">
        Your Taste Profile is Empty
      </h2>
      <p className="text-zinc-500 mb-8 leading-relaxed">
        We need a few details about what you like before the AI can generate recommendations! Add movies to your Watchlist or write a Review/Rating.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/search"
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-semibold px-6 py-3.5 rounded-xl transition duration-300"
        >
          Search Movies
        </Link>
        <Link
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3.5 rounded-xl transition duration-300"
        >
          Explore Trending
        </Link>
      </div>
    </div>
  );

  // Render Loading State
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-16 h-16 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mb-8"></div>
      <p className="text-lg text-zinc-400 font-medium animate-pulse">
        {loadingMessage}
      </p>
    </div>
  );

  return (
    <main className="bg-black text-white min-h-screen flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 mb-16">
        {loadingUser ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-zinc-800 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        ) : !user ? (
          renderLoginCTA()
        ) : loadingRecs ? (
          renderLoading()
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p className="text-xl font-bold mb-2">Failed to load recommendations</p>
            <p className="text-sm text-zinc-500">{error}</p>
            <button
              onClick={() => fetchProfileAndRecommendations(user)}
              className="mt-6 bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 rounded-xl border border-zinc-800 text-white transition"
            >
              Try Again
            </button>
          </div>
        ) : watchlist.length === 0 && reviews.length === 0 ? (
          renderEmptyProfile()
        ) : (
          <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 border-b border-zinc-900 pb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-zinc-100 to-red-500 bg-clip-text text-transparent mb-3">
                  AI Recommendations
                </h1>
                <p className="text-zinc-500">
                  Custom-tailored selection based on your Watchlist and Reviews.
                </p>
              </div>

              <div>
                <span className="bg-red-950/40 text-red-400 border border-red-900/60 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  {engineSource === "gemini" ? "Google Gemini Core" : "Local Similarity Engine"}
                </span>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-12">
              {recommendations.map((movie: any) => (
                <div
                  key={movie.id}
                  className="bg-zinc-950 border border-zinc-900 hover:border-zinc-850 rounded-3xl p-6 md:p-8 grid md:grid-cols-[200px_1fr] gap-8 transition duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                >
                  {/* Poster */}
                  <Link href={`/movie/${movie.id}`} className="group block">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/no-poster.png"
                      }
                      alt={movie.title}
                      className="rounded-2xl w-full object-cover aspect-[2/3] group-hover:scale-105 transition duration-500 shadow-lg"
                    />
                  </Link>

                  {/* Details & Explanation */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <Link href={`/movie/${movie.id}`}>
                            <h2 className="text-2xl md:text-3xl font-bold hover:text-red-500 transition">
                              {movie.title}
                            </h2>
                          </Link>
                          <p className="text-sm text-zinc-500 mt-1">
                            Released: {movie.release_date || "Unknown"} • ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                          </p>
                        </div>
                      </div>

                      <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                        {movie.overview}
                      </p>
                    </div>

                    {/* AI Explanation Card */}
                    <div className="relative border border-zinc-800 bg-zinc-900/40 rounded-2xl p-5 mb-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-900"></div>
                      <h4 className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span>🤖</span> AI Insight
                      </h4>
                      <p className="text-zinc-300 text-sm italic leading-relaxed">
                        "{movie.explanation}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/movie/${movie.id}`}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                      >
                        More Info
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
