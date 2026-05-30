import BackButton from "../components/BackButton";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import WatchlistBottomNav from "../components/WatchlistBottomNav";

export const dynamic = "force-dynamic";

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
    console.error(error);
    return [];
  }

  return data;
}

export default async function WatchlistPage() {
  const movies = await getWatchlist();

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans pb-32 selection:bg-amber-500 selection:text-black">
      
      {/* 1. TOP CENTER BRANDING */}
      <header className="w-full py-6 flex flex-col items-center justify-center border-b border-neutral-900 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-2xl font-black tracking-widest text-amber-500 text-center">
          CHITRA VISHESHALU
        </h1>
        <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mt-1">
          DISCOVER • PLAY • DEBATE
        </p>
      </header>

      {/* MAIN CONTAINER WITH PREMIUM GAP SIZES */}
      <main className="max-w-4xl mx-auto pt-16 px-8 sm:px-12 md:px-16 pb-12">
        
        <div className="space-y-12">
          
          {/* Header area with Back button and Title */}
          <div className="space-y-4">
            <BackButton />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              My Watchlist
            </h1>
          </div>

          {/* Empty State Container */}
          {movies.length === 0 && (
            <div className="text-center py-16 bg-neutral-950/40 rounded-3xl border border-neutral-900 shadow-2xl max-w-xl mx-auto p-8 space-y-6">
              <span className="text-5xl block animate-pulse">🍿</span>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white">
                  Your cinematic journey starts here.
                </h2>
                <p className="text-neutral-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Add movies to your watchlist to begin tracking your favorites!
                </p>
              </div>
              <Link
                href="/search"
                className="inline-block bg-white hover:bg-zinc-200 text-[#111111] font-bold px-6 py-3 rounded-full text-xs transition duration-300 shadow-md cursor-pointer"
              >
                Find Movies to Add
              </Link>
            </div>
          )}

          {/* Stored Movies Grid */}
          {movies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {movies.map((movie: any) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.movie_id}`}
                  className="group flex flex-col bg-neutral-900/30 rounded-xl overflow-hidden border border-neutral-900/50 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="relative aspect-[2/3] bg-neutral-950 overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.movie_title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="font-bold text-xs text-neutral-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {movie.movie_title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

      </main>

      {/* fixed bottom navigation bar client wrapper */}
      <WatchlistBottomNav />

    </div>
  );
}