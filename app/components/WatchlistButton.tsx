"use client";

import { useEffect, useState } from "react";
import { supabase, getSessionUser } from "../lib/supabase";

type Props = {
  movieId: string;
  movieTitle: string;
  posterPath: string;
};

export default function WatchlistButton({
  movieId,
  movieTitle,
  posterPath,
}: Props) {

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWatchlist();
  }, []);

  const checkWatchlist = async () => {
    const user = await getSessionUser();

    if (!user) return;

    const { data } = await supabase
      .from("watchlists")
      .select("*")
      .eq("movie_id", movieId)
      .eq("user_id", user.id)
      .single();

    if (data) {
      setSaved(true);
    }
  };

  const toggleWatchlist = async () => {

    setLoading(true);

    const user = await getSessionUser();

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    if (saved) {

      await supabase
        .from("watchlists")
        .delete()
        .eq("movie_id", movieId)
        .eq("user_id", user.id);

      setSaved(false);

    } else {

      await supabase
        .from("watchlists")
        .insert([
          {
            user_id: user.id,
            movie_id: movieId,
            movie_title: movieTitle,
            poster_path: posterPath,
          },
        ]);

      setSaved(true);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      className={`px-6 py-3 rounded-full text-xs md:text-sm font-bold transition duration-300 shadow-md ${
        saved
          ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
          : "bg-white hover:bg-zinc-200 text-[#111111]"
      }`}
    >
      {loading
        ? "Loading..."
        : saved
        ? "✓ In Watchlist"
        : "+ Add to Watchlist"}
    </button>
  );
}