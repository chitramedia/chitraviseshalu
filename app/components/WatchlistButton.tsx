"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

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
      className={`px-6 py-3 rounded-xl font-semibold transition duration-300 ${
        saved
          ? "bg-green-600 hover:bg-green-700"
          : "bg-zinc-900 border border-zinc-700 hover:border-red-500"
      }`}
    >
      {loading
        ? "Loading..."
        : saved
        ? "✓ Saved"
        : "+ Add to Watchlist"}
    </button>
  );
}