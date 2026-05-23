export default function Loading() {

  return (
    <main className="min-h-screen bg-black text-white animate-pulse">

      {/* Backdrop */}
      <div className="h-[60vh] bg-zinc-900"></div>

      <div className="max-w-7xl mx-auto px-6 py-10 relative -mt-52">

        <div className="grid md:grid-cols-[300px_1fr] gap-10">

          {/* Poster */}
          <div className="w-full h-[450px] rounded-2xl bg-zinc-900"></div>

          {/* Content */}
          <div>

            <div className="h-4 w-32 bg-zinc-800 rounded mb-5"></div>

            <div className="h-14 w-3/4 bg-zinc-800 rounded mb-6"></div>

            <div className="space-y-3 mb-8">

              <div className="h-4 bg-zinc-800 rounded"></div>
              <div className="h-4 bg-zinc-800 rounded"></div>
              <div className="h-4 w-5/6 bg-zinc-800 rounded"></div>

            </div>

            {/* Genres */}
            <div className="flex gap-3 mb-8">

              <div className="h-10 w-24 rounded-full bg-zinc-800"></div>
              <div className="h-10 w-20 rounded-full bg-zinc-800"></div>
              <div className="h-10 w-28 rounded-full bg-zinc-800"></div>

            </div>

            {/* Info */}
            <div className="flex gap-4">

              <div className="h-12 w-32 rounded-full bg-zinc-800"></div>
              <div className="h-12 w-32 rounded-full bg-zinc-800"></div>
              <div className="h-12 w-32 rounded-full bg-zinc-800"></div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}