import Link from "next/link";
import SearchBar from "../components/SearchBar";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

async function searchMovies(query: string) {

  if (!query) return [];

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    }
  );

  const data = await response.json();

  return data.results;
}

type Props = {
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {

  const { query } = await searchParams;

  const movies = await searchMovies(query || "");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#111111] text-white px-6 pt-28 pb-16">

        <div className="max-w-7xl mx-auto">
          <BackButton />

          {/* Hero */}
          <div className="mb-14 text-center mt-6">

            <p className="uppercase tracking-[0.3em] text-white/60 text-xs font-bold mb-4">
              Search Movies
            </p>

            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-5">
              Discover Trending Cinema
            </h1>

            <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Search trending movies, explore cinematic details,
              community reviews, ratings, and discover your next
              favorite film.
            </p>

          </div>

          {/* Live Search */}
          <div className="mb-14 max-w-3xl mx-auto">
            <SearchBar />
          </div>

          {/* Empty State */}
          {query && movies.length === 0 && (

            <div className="text-center py-20 bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl max-w-xl mx-auto shadow-lg">

              <h2 className="text-2xl font-bold mb-2">
                No Movies Found
              </h2>

              <p className="text-zinc-400 text-sm">
                Try searching for another movie title.
              </p>

            </div>

          )}

          {/* Initial Empty State */}
          {!query && (

            <div className="text-center py-20 bg-[#1A1A1A]/40 border border-zinc-800/20 rounded-3xl max-w-xl mx-auto shadow-md">
              <span className="text-5xl block mb-4">🎥</span>
              <h2 className="text-2xl font-bold mb-2 text-white">
                Start Exploring Movies
              </h2>

              <p className="text-zinc-400 text-sm">
                Search for your favorite movies, reviews,
                and trending cinema.
              </p>

            </div>

          )}

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {movies?.map((movie: any) => (

              <Link
                href={`/movie/${movie.id}`}
                key={movie.id}
                className="group flex flex-col transition duration-300"
              >

                <div className="relative bg-[#1A1A1A] border border-zinc-800/30 rounded-2xl overflow-hidden hover:border-white/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition duration-300">

                  {/* Poster */}
                  <div className="relative overflow-hidden aspect-[2/3] bg-[#111111]">

                    <div className="absolute inset-0 animate-pulse bg-zinc-850"></div>

                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-poster.png"}
                      alt={movie.title}
                      className="relative w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                    />

                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent opacity-95"></div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-[#111111]/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-yellow-400 font-bold border border-zinc-800/40">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 p-5 w-full">

                    <h2 className="text-base font-bold text-white group-hover:text-zinc-350 transition line-clamp-1 leading-snug">
                      {movie.title}
                    </h2>

                    <p className="text-zinc-500 text-xs mt-1">
                      {movie.release_date || "Unknown date"}
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}