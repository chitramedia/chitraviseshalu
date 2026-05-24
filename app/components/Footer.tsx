export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black/80 backdrop-blur-xl mt-20">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>

            <h2 className="text-2xl font-extrabold mb-4">
              <span className="text-white">Chitra</span>{" "}
              <span className="text-red-600">Viseshalu</span>
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              Discover trending movies, OTT reviews,
              cinematic discussions, audience reactions,
              and entertainment updates from the community.
            </p>

          </div>

          {/* Navigation */}
          <div>

            <h3 className="font-bold mb-4 text-white">
              Explore
            </h3>

            <div className="flex flex-col gap-3 text-zinc-400">

              <a
                href="/"
                className="hover:text-red-500 transition"
              >
                Home
              </a>

              <a
                href="/reviews"
                className="hover:text-red-500 transition"
              >
                Reviews
              </a>

              <a
                href="/news"
                className="hover:text-red-500 transition"
              >
                Cinema News
              </a>

              <a
                href="/search"
                className="hover:text-red-500 transition"
              >
                Search Movies
              </a>

              <a
                href="/admin"
                className="hover:text-red-500 transition"
              >
                Admin Tools
              </a>

            </div>

          </div>

          {/* Community */}
          <div>

            <h3 className="font-bold mb-4 text-white">
              Community
            </h3>

            <p className="text-zinc-400 leading-relaxed">
              Built for movie lovers who enjoy discovering,
              reviewing, and discussing trending cinema.
            </p>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-zinc-500">

          <p>
            © 2026 Chitra Viseshalu. All rights reserved.
          </p>

          <p>
            Powered by TMDB API & Supabase
          </p>

        </div>

      </div>

    </footer>
  );
}