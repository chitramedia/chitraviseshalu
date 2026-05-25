import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
    <>
      <Navbar />

      <main className="min-h-screen bg-[#111111] text-white px-6 pt-28 pb-16">

        <div className="max-w-7xl mx-auto">
          <BackButton />

          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-10 mt-6">
            My Watchlist
          </h1>

          {/* Empty State */}
          {movies.length === 0 && (
            <div className="text-center py-16 bg-[#1A1A1A] rounded-3xl border border-zinc-800/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] max-w-xl mx-auto p-8 space-y-6">
              <span className="text-5xl block animate-pulse">🍿</span>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">
                  Your watchlist is waiting for its first masterpiece.
                </h2>
                <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Browse movies, read critiques, and save recommendations to customize your profile.
                </p>
              </div>
              <Link
                href="/search"
                className="inline-block bg-white hover:bg-zinc-200 text-[#111111] font-bold px-6 py-3 rounded-full text-xs transition duration-300 shadow-md"
              >
                Find Movies to Add
              </Link>
            </div>
          )}

          {/* Movies */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

            {movies.map((movie: any) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.movie_id}`}
                className="group flex flex-col transition duration-300"
              >

                <div className="overflow-hidden rounded-2xl bg-[#1A1A1A] mb-3 transition duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.movie_title}
                    className="w-full object-cover aspect-[2/3] transition duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <h2 className="font-semibold text-sm group-hover:text-zinc-350 transition line-clamp-2 leading-snug">
                  {movie.movie_title}
                </h2>

              </Link>
            ))}

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}