import ReviewSection from "@/app/components/ReviewSection";

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

export default async function MoviePage({ params }: Props) {
  const { id } = await params;

  const movie = await getMovie(id);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Backdrop */}
      <div className="relative h-[60vh] overflow-hidden">

        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 relative -mt-52 z-10">

        <div className="grid md:grid-cols-[300px_1fr] gap-10">

          {/* Poster */}
          <div>

            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-2xl shadow-2xl"
            />

          </div>

          {/* Details */}
          <div>

            <p className="uppercase text-red-500 tracking-widest text-sm mb-3">
              Movie Details
            </p>

            <h1 className="text-5xl font-extrabold mb-4">
              {movie.title}
            </h1>

            <p className="text-zinc-400 leading-relaxed text-lg max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-6 mt-8 text-sm text-zinc-300">

              <div>
                ⭐ Rating: {movie.vote_average?.toFixed(1)}
              </div>

              <div>
                📅 Release: {movie.release_date}
              </div>

              <div>
                🎬 Runtime: {movie.runtime} mins
              </div>

            </div>

          </div>

        </div>

        {/* Review Section */}
        <ReviewSection movieId={id} />

      </div>

    </main>
  );
}