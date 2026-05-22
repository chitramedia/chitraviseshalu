import Link from "next/link";

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

      {/* Heading */}
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-extrabold mb-10">
          Search Movies
        </h1>

        {/* Search Form */}
        <form className="mb-12">

          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Search movies..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-lg outline-none focus:border-red-600"
          />

        </form>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {movies?.map((movie: any) => (

            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
            >

              <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-600 transition cursor-pointer">

                <div className="overflow-hidden">

                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-[420px] object-cover group-hover:scale-105 transition duration-300"
                  />

                </div>

                <div className="p-5">

                  <h2 className="text-xl font-bold group-hover:text-red-500 transition">
                    {movie.title}
                  </h2>

                  <p className="text-zinc-400 mt-2 text-sm">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </p>

                  <p className="text-zinc-500 mt-2 text-sm">
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