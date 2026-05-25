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
    <section className="relative w-full h-screen flex items-end pb-24 overflow-hidden">

      {/* Backdrop */}
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* The Vignette (Gradient Overlay) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/0 via-[#111111]/40 to-[#111111] z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 via-[#111111]/20 to-transparent z-10 pointer-events-none"></div>

      {/* Content (Bottom-Left Quadrant) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-8">

        {/* Tag / Featured */}
        <p className="uppercase tracking-[0.2em] text-white/60 text-xs md:text-sm font-bold mb-3">
          🔥 Trending Worldwide
        </p>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight max-w-4xl drop-shadow-2xl">
          {movie.title}
        </h1>

        {/* Description */}
        <p className="mt-4 text-zinc-300 text-sm md:text-base max-w-2xl leading-relaxed line-clamp-2">
          {movie.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8">

          <a
            href="/reviews"
            className="bg-white hover:bg-zinc-200 text-[#111111] font-bold px-8 py-3.5 rounded-full transition duration-300 shadow-lg text-sm"
          >
            Read Review
          </a>

          <a
            href={`/movie/${movie.id}`}
            className="border border-white/40 hover:border-white hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-full transition duration-300 text-sm"
          >
            Watch Trailer
          </a>

        </div>

      </div>

    </section>
  );
}