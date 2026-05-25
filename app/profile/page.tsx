"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import BackButton from "../components/BackButton";
import EditProfile from "../components/EditProfile";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface ProfileMetadata {
  bio?: string;
  avatar?: string;
  favoriteGenres?: string[];
  location?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Meta states
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("🍿");
  const [genres, setGenres] = useState<string[]>([]);
  const [watchedHistory, setWatchedHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"watchlist" | "watched" | "reviews">("watchlist");

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUser(user);

    // Dynamic browser document title for client-side SEO
    if (typeof document !== "undefined") {
      document.title = `${user.email?.split("@")[0]}'s Profile | Chitra Viseshalu`;
    }

    // Fetch watchlist
    const { data: watchlistData } = await supabase
      .from("watchlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Fetch reviews
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", { ascending: false });

    setWatchlist(watchlistData || []);
    setReviews(reviewsData || []);

    // Load metadata
    const metaStored = localStorage.getItem(`profile_meta_${user.id}`);
    if (metaStored) {
      try {
        const meta = JSON.parse(metaStored) as ProfileMetadata;
        if (meta.bio) setBio(meta.bio);
        if (meta.avatar) setAvatar(meta.avatar);
        if (meta.location) setLocation(meta.location);
        if (meta.favoriteGenres) setGenres(meta.favoriteGenres);
      } catch (e) {
        console.error(e);
      }
    }

    // Load watched history
    const historyStored = localStorage.getItem(`watched_history_${user.id}`);
    if (historyStored) {
      try {
        setWatchedHistory(JSON.parse(historyStored));
      } catch {}
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();

    // Listen to profile updates from EditProfile component
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    window.addEventListener("profileUpdate", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdate", handleProfileUpdate);
    };
  }, []);

  const toggleWatched = (movie: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    let updatedHistory = [...watchedHistory];
    const exists = watchedHistory.some((item) => item.movie_id === movie.movie_id);

    if (exists) {
      updatedHistory = updatedHistory.filter((item) => item.movie_id !== movie.movie_id);
    } else {
      updatedHistory.push({
        movie_id: movie.movie_id,
        movie_title: movie.movie_title || movie.title,
        poster_path: movie.poster_path,
        watched_at: new Date().toISOString(),
      });
    }

    setWatchedHistory(updatedHistory);
    localStorage.setItem(`watched_history_${user.id}`, JSON.stringify(updatedHistory));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
            <span className="text-zinc-500 text-sm font-semibold">Loading Profile...</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-sm bg-[#1A1A1A] border border-zinc-800/30 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <span className="text-6xl block">🔒</span>
            <h1 className="text-3xl font-black">Authentication Required</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Log in to access your personal dashboard, watchlists, cinema reviews, and customized AI recommendations.
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-white hover:bg-zinc-200 text-[#111111] font-bold px-6 py-3.5 rounded-full transition duration-300 shadow-md text-sm"
            >
              Sign In / Sign Up
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Calculate Average Rating Given
  const totalReviews = reviews.length;
  const averageRatingGiven =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "0.0";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#111111] text-white px-4 md:px-6 pt-28 pb-16">
        <div className="max-w-6xl mx-auto space-y-10">
          <BackButton />

          {/* Profile Card Layout */}
          <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              {/* Avatar Selector display */}
              <div className="w-24 h-24 rounded-3xl bg-[#111111] border border-zinc-800/60 flex items-center justify-center text-5xl shadow-xl flex-shrink-0">
                {avatar}
              </div>

              {/* Bio & Details */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                    {user.email?.split("@")[0]}
                  </h1>
                  {location && (
                    <span className="inline-flex items-center gap-1.5 self-center bg-[#111111] border border-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-400">
                      📍 {location}
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/60 font-semibold">{user.email}</p>

                <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">
                  {bio || "This cinephile hasn't written a biography yet."}
                </p>

                {/* Genre Preferences */}
                {genres.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-1.5 pt-1">
                    {genres.map((genre) => (
                      <span
                        key={genre}
                        className="bg-[#111111] border border-zinc-800 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/40 mt-8 pt-6 relative z-10 text-center">
              <div className="py-2 border-r border-zinc-800/40">
                <span className="text-zinc-500 text-xs uppercase tracking-wider block">Watchlist</span>
                <span className="text-2xl font-black text-white mt-1 block">{watchlist.length}</span>
              </div>
              <div className="py-2 border-r border-zinc-800/40">
                <span className="text-zinc-500 text-xs uppercase tracking-wider block">Critiques</span>
                <span className="text-2xl font-black text-white mt-1 block">{reviews.length}</span>
              </div>
              <div className="py-2">
                <span className="text-zinc-500 text-xs uppercase tracking-wider block">Avg Rating</span>
                <span className="text-2xl font-black text-yellow-400 mt-1 block">★ {averageRatingGiven}</span>
              </div>
            </div>
          </div>

          {/* Edit Profile options */}
          <EditProfile />

          {/* User Movie lists tabs */}
          <div className="space-y-6">
            {/* Tabs selector */}
            <div className="flex border-b border-zinc-850 gap-6 text-sm font-bold">
              <button
                onClick={() => setActiveTab("watchlist")}
                className={`pb-3 transition relative ${
                  activeTab === "watchlist" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                My Watchlist ({watchlist.length})
                {activeTab === "watchlist" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("watched")}
                className={`pb-3 transition relative ${
                  activeTab === "watched" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Watched History ({watchedHistory.length})
                {activeTab === "watched" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 transition relative ${
                  activeTab === "reviews" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                My Reviews ({reviews.length})
                {activeTab === "reviews" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></span>
                )}
              </button>
            </div>

            {/* Watchlist content */}
            {activeTab === "watchlist" && (
              <div className="space-y-6">
                {watchlist.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-10 text-center bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl">
                    Your watchlist is empty. Add movies to plan your next watch!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                    {watchlist.map((movie: any) => (
                      <div key={movie.id} className="group relative bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl overflow-hidden hover:border-white/10 transition duration-300 shadow-md flex flex-col justify-between">
                        <div className="overflow-hidden bg-[#111111]">
                          <Link href={`/movie/${movie.movie_id}`}>
                            <img
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.movie_title}
                              className="w-full h-64 object-cover group-hover:scale-[1.03] transition duration-500"
                            />
                          </Link>
                        </div>
                        <div className="p-3.5 space-y-2 flex flex-col justify-between flex-1">
                          <Link href={`/movie/${movie.movie_id}`}>
                            <h3 className="font-bold text-sm text-zinc-200 group-hover:text-zinc-350 transition line-clamp-1 leading-snug">
                              {movie.movie_title}
                            </h3>
                          </Link>
                          <button
                            onClick={(e) => toggleWatched(movie, e)}
                            className={`w-full py-1.5 border rounded-lg text-[10px] uppercase font-bold tracking-wider transition ${
                              watchedHistory.some((item) => item.movie_id === movie.movie_id)
                                ? "bg-green-600/10 border-green-500 text-green-500"
                                : "bg-[#111111] border-zinc-800 hover:border-white/20 text-zinc-400"
                            }`}
                          >
                            {watchedHistory.some((item) => item.movie_id === movie.movie_id)
                              ? "✓ Watched"
                              : "Mark Watched"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Watched History content */}
            {activeTab === "watched" && (
              <div className="space-y-6">
                {watchedHistory.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-10 text-center bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl">
                    You haven't marked any movies as watched yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                    {watchedHistory.map((movie: any) => (
                      <div key={movie.movie_id} className="group relative bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl overflow-hidden hover:border-white/10 transition duration-300 shadow-md flex flex-col justify-between">
                        <div className="overflow-hidden bg-[#111111]">
                          <Link href={`/movie/${movie.movie_id}`}>
                            <img
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt={movie.movie_title}
                              className="w-full h-64 object-cover group-hover:scale-[1.03] transition duration-500"
                            />
                          </Link>
                        </div>
                        <div className="p-3.5 space-y-2 flex flex-col justify-between flex-1">
                          <Link href={`/movie/${movie.movie_id}`}>
                            <h3 className="font-bold text-sm text-zinc-200 group-hover:text-zinc-350 transition line-clamp-1 leading-snug">
                              {movie.movie_title}
                            </h3>
                          </Link>
                          <button
                            onClick={(e) => toggleWatched(movie, e)}
                            className="w-full py-1.5 bg-[#111111] border border-zinc-850 hover:border-white/20 text-zinc-400 hover:text-white rounded-lg text-[10px] uppercase font-bold tracking-wider transition"
                          >
                            Remove History
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews content */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-10 text-center bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl">
                    No critiques written yet. Share your cinematic views on movie pages!
                  </p>
                ) : (
                  reviews.map((review: any) => (
                    <Link
                      key={review.id}
                      href={`/movie/${review.movie_id}`}
                      className="block bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl p-5 hover:border-white/10 transition shadow-md"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-white text-lg group-hover:text-zinc-300 transition">{review.movie_title}</h3>
                          <span className="text-[10px] text-zinc-550 mt-1 block">
                            {new Date(review.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex text-yellow-450 text-base">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>{review.rating >= star ? "★" : "☆"}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-350 text-sm mt-3 leading-relaxed line-clamp-3">
                        {review.review_text.startsWith("{\"") ? JSON.parse(review.review_text).text : review.review_text}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}