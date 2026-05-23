export default function Loading() {

  return (
    <main className="min-h-screen bg-black text-white animate-pulse">

      {/* Hero */}
      <div className="h-[90vh] bg-zinc-900"></div>

      {/* Trending */}
      <div className="max-w-7xl mx-auto px-6 py-20">

        <div className="h-6 w-40 bg-zinc-800 rounded mb-10"></div>

        <div className="flex gap-6 overflow-hidden">

          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="min-w-[220px]"
            >

              <div className="h-[330px] rounded-2xl bg-zinc-900 mb-4"></div>

              <div className="h-5 bg-zinc-800 rounded mb-2"></div>

              <div className="h-4 w-20 bg-zinc-800 rounded"></div>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}