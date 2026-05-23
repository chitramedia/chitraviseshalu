export const dynamic = "force-dynamic";

import { supabase } from "../lib/supabase";
import Link from "next/link";

async function getWatchlist() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("watchlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

export default async function WatchlistPage() {

  const movies = await getWatchlist();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-extrabold mb-10">
          My Watchlist
        </h1>

        {/* Empty State */}
        {movies.length === 0 && (

          <div className="text-center py-20">

            <h2 className="text-3xl font-bold mb-4">
              Watchlist Empty
            </h2>

            <p className="text-zinc-500">
              Save movies to build your personal watchlist.
            </p>

          </div>

        )}

        {/* Movies */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

          {movies.map((movie: any) => (
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

              <h2 className="font-semibold group-hover:text-red-500 transition">
                {movie.movie_title}
              </h2>

            </Link>
          ))}

        </div>

      </div>

    </main>
  );
}