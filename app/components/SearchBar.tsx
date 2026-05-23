"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchBar() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchMovies = async () => {

      if (!query) {
        setMovies([]);
        return;
      }

      setLoading(true);

      const response = await fetch(
        `/api/search?query=${query}`
      );

      const data = await response.json();

      setMovies(data.results || []);

      setLoading(false);
    };

    const timer = setTimeout(fetchMovies, 300);

    return () => clearTimeout(timer);

  }, [query]);

  return (
    <div className="relative w-full">

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl px-6 py-5 text-lg outline-none focus:border-red-600 transition"
      />

      {/* Dropdown */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-[500px] overflow-y-auto">

          {loading && (
            <div className="p-5 text-zinc-400">
              Searching...
            </div>
          )}

          {!loading && movies.length === 0 && (
            <div className="p-5 text-zinc-500">
              No movies found.
            </div>
          )}

          {!loading && movies.map((movie) => (

            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="flex items-center gap-4 p-4 hover:bg-zinc-900 transition border-b border-zinc-800"
            >

              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-14 rounded-lg object-cover"
              />

              <div>

                <h3 className="font-semibold">
                  {movie.title}
                </h3>

                <p className="text-sm text-zinc-500">
                  {movie.release_date}
                </p>

              </div>

            </Link>

          ))}

        </div>
      )}

    </div>
  );
}