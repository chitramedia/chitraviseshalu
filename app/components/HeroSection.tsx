import FeaturedAnnouncement from "./FeaturedAnnouncement";

async function getTrendingMovie() {
  const response = await fetch(
    "https://api.themoviedb.org/3/trending/movie/day",
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    }
  );

  return response.json();
}

export default async function HeroSection() {

  const data = await getTrendingMovie();

  const movie = data.results[0];

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">

      {/* Backdrop */}
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40"></div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Featured Announcement */}
        <FeaturedAnnouncement />

        {/* Tag */}
        <p className="uppercase tracking-[0.3em] text-red-500 text-sm mb-4">
          Trending Worldwide
        </p>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl drop-shadow-2xl">
          {movie.title}
        </h1>

        {/* Overview */}
        <p className="mt-6 text-zinc-300 text-lg max-w-2xl leading-relaxed line-clamp-4">
          {movie.overview}
        </p>

        {/* Info */}
        <div className="flex flex-wrap gap-6 mt-6 text-sm text-zinc-300">

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800">
            ⭐ {movie.vote_average?.toFixed(1)}
          </div>

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800">
            🔥 Trending Now
          </div>

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800">
            🌍 TMDB Global
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-10">

          <a
            href={`/movie/${movie.id}`}
            className="bg-red-600 hover:bg-red-700 hover:scale-105 px-7 py-3 rounded-xl font-semibold transition duration-300 shadow-[0_0_25px_rgba(220,38,38,0.35)]"
          >
            ▶ View Details
          </a>

          <a
            href="/reviews"
            className="border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/80 backdrop-blur-md px-7 py-3 rounded-xl transition duration-300"
          >
            ★ Explore Reviews
          </a>

        </div>

      </div>

    </section>
  );
}