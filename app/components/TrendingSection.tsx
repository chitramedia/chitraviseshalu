import Link from "next/link";
import { getTrendingMovies } from "../lib/tmdb";

export default async function TrendingSection() {

  const movies = await getTrendingMovies();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <p className="text-red-500 text-sm uppercase tracking-widest mb-2">
            Trending Now
          </p>

          <h2 className="text-4xl font-bold">
            Trending Movies
          </h2>

        </div>

        <a
          href="/search"
          className="text-zinc-400 hover:text-white transition"
        >
          Explore More →
        </a>

      </div>

      {/* Movie Row */}
      <div className="flex gap-6 overflow-x-auto pb-4">

        {movies?.slice(0, 12).map((movie: any) => (

          <Link
            href={`/movie/${movie.id}`}
            key={movie.id}
            className="group min-w-[220px]"
          >

            <div
              className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-600 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] transition duration-300"
            >

              {/* Poster */}
              <div className="relative overflow-hidden">

                {/* Skeleton Loader */}
                <div className="absolute inset-0 animate-pulse bg-zinc-800"></div>

                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="relative w-full h-[330px] object-cover group-hover:scale-110 transition duration-500"
                />

              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90"></div>

              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-yellow-400 font-semibold border border-zinc-700">
                ⭐ {movie.vote_average.toFixed(1)}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 p-5 w-full">

                <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition">
                  {movie.title}
                </h3>

                <p className="text-zinc-400 text-sm mt-1">
                  {movie.release_date}
                </p>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </section>
  );
}