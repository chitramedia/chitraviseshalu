import Link from "next/link";
import { getTrendingMovies } from "../lib/tmdb";

export default async function TrendingSection() {

  const movies = await getTrendingMovies();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      <div className="flex items-center justify-between mb-10">

        <div>
          <p className="text-red-500 text-sm uppercase tracking-widest mb-2">
            Trending Now
          </p>

          <h2 className="text-4xl font-bold">
            Trending Movies
          </h2>
        </div>

        <button className="text-zinc-400 hover:text-white transition">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {movies?.slice(0, 8).map((movie: any) => (

          <Link
            href={`/movie/${movie.id}`}
            key={movie.id}
          >

            <div
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-600 transition cursor-pointer"
            >

              {/* Movie Poster */}
              <div className="overflow-hidden">

                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-300"
                />

              </div>

              {/* Content */}
              <div className="p-5">

                <h3 className="text-xl font-bold group-hover:text-red-500 transition">
                  {movie.title}
                </h3>

                <p className="text-zinc-400 mt-2 text-sm">
                  ⭐ {movie.vote_average.toFixed(1)} / 10
                </p>

                <p className="text-zinc-500 mt-2 text-sm">
                  Release: {movie.release_date}
                </p>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}