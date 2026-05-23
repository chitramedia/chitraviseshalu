import Link from "next/link";
import SearchBar from "../components/SearchBar";

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
    <main className="min-h-screen bg-black text-white px-6 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <div className="mb-14 text-center">

          <p className="uppercase tracking-[0.3em] text-red-500 text-sm mb-4">
            Search Movies
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-5">
            Discover Trending Cinema
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Search trending movies, explore cinematic details,
            community reviews, ratings, and discover your next
            favorite film.
          </p>

        </div>

        {/* Live Search */}
        <div className="mb-14">
          <SearchBar />
        </div>

        {/* Empty State */}
        {query && movies.length === 0 && (

          <div className="text-center py-20">

            <h2 className="text-3xl font-bold mb-4">
              No Movies Found
            </h2>

            <p className="text-zinc-500">
              Try searching for another movie title.
            </p>

          </div>

        )}

        {/* Initial Empty State */}
        {!query && (

          <div className="text-center py-20">

            <h2 className="text-3xl font-bold mb-4">
              Start Exploring Movies
            </h2>

            <p className="text-zinc-500">
              Search for your favorite movies, reviews,
              and trending cinema.
            </p>

          </div>

        )}

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {movies?.map((movie: any) => (

            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="group"
            >

              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-600 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] transition duration-300">

                {/* Poster */}
                <div className="relative overflow-hidden">

                  <div className="absolute inset-0 animate-pulse bg-zinc-800"></div>

                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="relative w-full h-[420px] object-cover group-hover:scale-110 transition duration-500"
                  />

                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90"></div>

                {/* Rating */}
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-yellow-400 font-semibold border border-zinc-700">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 p-5 w-full">

                  <h2 className="text-lg font-bold text-white group-hover:text-red-500 transition">
                    {movie.title}
                  </h2>

                  <p className="text-zinc-400 text-sm mt-1">
                    {movie.release_date}
                  </p>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}