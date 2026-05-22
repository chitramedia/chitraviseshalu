export default function HeroSection() {
  return (
    <section className="relative h-[85vh] flex items-center overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
        alt="Cinema"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <p className="uppercase tracking-[0.3em] text-red-500 text-sm mb-4">
          Entertainment Community Platform
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl">
          Discover Movies, OTT Reviews & Viral Reactions
        </h1>

        <p className="mt-6 text-zinc-300 text-lg max-w-2xl leading-relaxed">
          Explore trending reviews, cinematic discussions,
          OTT updates, audience reactions, and community-driven
          entertainment content.
        </p>

        <div className="flex flex-wrap gap-4 mt-10">

          <button className="bg-red-600 hover:bg-red-700 px-7 py-3 rounded-xl font-semibold transition">
            Explore Reviews
          </button>

          <button className="border border-zinc-700 hover:border-zinc-500 px-7 py-3 rounded-xl transition">
            Join Community
          </button>

        </div>
      </div>
    </section>
  );
}