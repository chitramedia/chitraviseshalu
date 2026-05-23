"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import BackButton from "../components/BackButton";
import EditProfile from "../components/EditProfile";
import Link from "next/link";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUser(user);

    const { data: watchlistData } = await supabase
      .from("watchlists")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_email", user.email)
      .order("created_at", { ascending: false });

    setWatchlist(watchlistData || []);
    setReviews(reviewsData || []);

    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Profile...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-4xl font-bold mb-4">
            Please Login
          </h1>

          <p className="text-zinc-500">
            Login to view your profile.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <BackButton />

        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-14">

          <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-3xl font-bold shadow-[0_0_25px_rgba(255,255,255,0.2)]">

            {user.email?.charAt(0).toUpperCase()}

          </div>

          <div>

            <h1 className="text-4xl font-extrabold">
              {user.email?.split("@")[0]}
            </h1>

            <p className="text-zinc-500 mt-2">
              {user.email}
            </p>

          </div>

        </div>

        {/* Edit Profile */}
        <EditProfile />

        {/* Watchlist */}
        <section className="mb-20">

          <h2 className="text-3xl font-bold mb-8">
            My Watchlist
          </h2>

          {watchlist.length === 0 ? (

            <p className="text-zinc-500">
              No saved movies yet.
            </p>

          ) : (

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

              {watchlist.map((movie: any) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.movie_id}`}
                  className="group"
                >

                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.movie_title}
                    className="rounded-2xl mb-3 group-hover:scale-105 transition duration-300"
                  />

                  <h3 className="font-semibold group-hover:text-red-500 transition">
                    {movie.movie_title}
                  </h3>

                </Link>
              ))}

            </div>

          )}

        </section>

        {/* Reviews */}
        <section>

          <h2 className="text-3xl font-bold mb-8">
            My Reviews
          </h2>

          {reviews.length === 0 ? (

            <p className="text-zinc-500">
              No reviews posted yet.
            </p>

          ) : (

            <div className="space-y-6">

              {reviews.map((review: any) => (
                <Link
                  key={review.id}
                  href={`/movie/${review.movie_id}`}
                  className="block border border-zinc-800 rounded-2xl p-6 hover:border-red-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(220,38,38,0.25)] transition duration-300 bg-zinc-950/40 backdrop-blur-md"
                >

                  <div className="flex justify-between items-start mb-4">

                    <div>

                      <h3 className="text-2xl font-bold">
                        {review.movie_title}
                      </h3>

                      <p className="text-zinc-500 text-sm mt-2">
                        {new Date(review.created_at).toLocaleString()}
                      </p>

                    </div>

                    <div className="flex text-yellow-400 text-xl">

                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {review.rating >= star ? "★" : "☆"}
                        </span>
                      ))}

                    </div>

                  </div>

                  <p className="text-zinc-300 leading-relaxed">
                    {review.review_text}
                  </p>

                </Link>
              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}