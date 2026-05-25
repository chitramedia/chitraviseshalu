import WatchlistButton from "@/app/components/WatchlistButton";
import BackButton from "@/app/components/BackButton";
import ReviewSection from "@/app/components/ReviewSection";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getMovie(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}`,
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

async function getSimilarMovies(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/similar`,
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

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(id);
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : "";

  return {
    title: `${movie.title} ${year ? `(${year})` : ""} - Cast, Reviews & OTT | Chitra Viseshalu`,
    description: movie.tagline || movie.overview?.substring(0, 160) || `Check out detailed reviews, ratings breakdown, runtime details, and box office details for ${movie.title} on Chitra Viseshalu.`,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: [
        {
          url: `https://image.tmdb.org/t/p/w780${movie.backdrop_path || movie.poster_path}`,
          alt: movie.title,
        },
      ],
    },
  };
}

const LANGUAGE_MAP: Record<string, string> = {
  te: "Telugu",
  ta: "Tamil",
  hi: "Hindi",
  ml: "Malayalam",
  kn: "Kannada",
  en: "English",
  es: "Spanish",
  ko: "Korean",
  ja: "Japanese",
};

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(id);
  const similarMovies = await getSimilarMovies(id);

  // Format currency helper
  const formatCurrency = (val: number) => {
    if (!val || val === 0) return "Not Disclosed";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Determine OTT streams mock badges based on ID/genres
  const ottProviders = [];
  const numericId = parseInt(id) || 0;
  if (numericId % 3 === 0) {
    ottProviders.push({ name: "Netflix", logo: "🍿", color: "bg-white/10 border-white/20 text-white" });
  }
  if (numericId % 2 === 0 || numericId % 5 === 0) {
    ottProviders.push({ name: "Prime Video", logo: "🔵", color: "bg-white/10 border-white/20 text-white" });
  }
  if (numericId % 7 === 0 || movie.genres?.some((g: any) => g.name === "Action")) {
    ottProviders.push({ name: "Hotstar", logo: "⭐", color: "bg-white/10 border-white/20 text-white" });
  }
  if (ottProviders.length === 0) {
    ottProviders.push({ name: "AHA Video", logo: "🍊", color: "bg-white/10 border-white/20 text-white" });
  }

  // Generate Awards label
  let awards = "";
  if (movie.vote_average >= 8.0) {
    awards = "🏆 Critically Acclaimed Masterpiece";
  } else if (movie.vote_average >= 7.0) {
    awards = "⭐ Fan Favorite Choice";
  } else if (movie.budget > 150000000) {
    awards = "🎬 Mega-Budget Blockbuster Action";
  }

  // JSON-LD structured schema for SEO optimization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.overview,
    "image": `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    "datePublished": movie.release_date,
    "genre": movie.genres?.map((g: any) => g.name),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": movie.vote_average,
      "bestRating": "10",
      "ratingCount": movie.vote_count || 100,
    },
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#111111] text-white pb-12">
        {/* Schema injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Backdrop */}
        <div className="relative h-[65vh] overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative -mt-64 z-10">
          {/* Back Button */}
          <BackButton />

          <div className="grid md:grid-cols-[320px_1fr] gap-8 md:gap-12 mt-6">
            {/* Left Column: Poster & Stream Information */}
            <div className="space-y-6">
              <div className="relative group overflow-hidden rounded-3xl border border-zinc-800/40 shadow-2xl">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition duration-500"
                />
                {awards && (
                  <div className="absolute bottom-4 left-4 right-4 bg-[#1A1A1A]/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-zinc-800/40 text-xs font-bold text-center text-white shadow-lg">
                    {awards}
                  </div>
                )}
              </div>

              {/* OTT Badges */}
              <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-5 space-y-3.5 shadow-md">
                <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold block">
                  Streaming Platform Availability
                </span>
                <div className="flex flex-col gap-2">
                  {ottProviders.map((prov) => (
                    <div
                      key={prov.name}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-bold ${prov.color}`}
                    >
                      <span>{prov.logo}</span>
                      <span>Stream on {prov.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Details & Advanced Metrics */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-[#1A1A1A] border border-zinc-800/65 text-zinc-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                    Chitra Cinefile
                  </span>
                  {movie.status && (
                    <span className="bg-[#1A1A1A] border border-zinc-800/40 text-zinc-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {movie.status}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className="text-white/60 italic text-base md:text-lg font-medium leading-relaxed">
                    "{movie.tagline}"
                  </p>
                )}

                <p className="text-zinc-300 leading-relaxed text-sm md:text-base max-w-4xl">
                  {movie.overview}
                </p>
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="bg-[#1A1A1A] border border-zinc-800/45 hover:border-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 transition"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#1A1A1A] border border-zinc-800/30 p-4 rounded-2xl shadow-md">
                  <span className="text-zinc-500 text-xs block font-semibold">TMDB Score</span>
                  <span className="text-lg font-black text-yellow-400 mt-1 block">★ {movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="bg-[#1A1A1A] border border-zinc-800/30 p-4 rounded-2xl shadow-md">
                  <span className="text-zinc-500 text-xs block font-semibold">Duration Time</span>
                  <span className="text-lg font-black text-white mt-1 block">⏱ {movie.runtime} mins</span>
                </div>
                <div className="bg-[#1A1A1A] border border-zinc-800/30 p-4 rounded-2xl shadow-md col-span-2 sm:col-span-1">
                  <span className="text-zinc-500 text-xs block font-semibold">Original Language</span>
                  <span className="text-lg font-black text-white mt-1 block">
                    🗣 {LANGUAGE_MAP[movie.original_language] || movie.original_language?.toUpperCase() || "Telugu"}
                  </span>
                </div>
              </div>

              {/* Box Office / Franchise Details Panel */}
              <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-5 md:p-6 space-y-4 shadow-md">
                <h3 className="text-base font-black text-white">💰 Box Office Statistics</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-zinc-500 text-xs font-semibold">Estimated Budget</span>
                    <p className="text-sm font-bold text-zinc-300">{formatCurrency(movie.budget)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-zinc-500 text-xs font-semibold">Global Box Office Revenue</span>
                    <p className="text-sm font-bold text-zinc-300">{formatCurrency(movie.revenue)}</p>
                  </div>
                </div>

                {movie.belongs_to_collection && (
                  <div className="border-t border-zinc-800/40 pt-4 mt-3 flex items-center gap-3">
                    <span className="text-2xl">🎬</span>
                    <div>
                      <span className="text-zinc-550 text-[10px] uppercase font-bold block tracking-wider">
                        Part of Franchise
                      </span>
                      <span className="text-xs font-bold text-white/80">
                        {movie.belongs_to_collection.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Watchlist Action */}
              <div className="pt-2">
                <WatchlistButton
                  movieId={id}
                  movieTitle={movie.title}
                  posterPath={movie.poster_path}
                />
              </div>
            </div>
          </div>

          {/* Detailed Reviews & Submissions */}
          <ReviewSection
            movieId={id}
            movieTitle={movie.title}
            posterPath={movie.poster_path}
          />
        </div>

        {/* Similar Movies */}
        {similarMovies.results?.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-6 mt-14">
            <h2 className="text-2xl md:text-3xl font-black mb-6">
              Recommended Similar Movies
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {similarMovies.results.slice(0, 10).map((item: any) => (
                <a
                  key={item.id}
                  href={`/movie/${item.id}`}
                  className="group min-w-[170px] bg-[#1A1A1A] border border-zinc-800/30 hover:border-white/10 p-2.5 rounded-2xl transition duration-300"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.title}
                    className="rounded-xl mb-3 w-full object-cover h-[220px] group-hover:scale-[1.03] transition duration-300"
                  />
                  <h3 className="font-bold text-xs text-zinc-350 group-hover:text-white transition line-clamp-1">
                    {item.title}
                  </h3>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}