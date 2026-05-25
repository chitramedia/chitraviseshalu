import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrendingSection from "./components/TrendingSection";
import MovieFeed from "./components/MovieFeed";
import HomeReviewsSection from "./components/HomeReviewsSection";
import CommunityPoll from "./components/CommunityPoll";
import Footer from "./components/Footer";
import ScrollTopButton from "./components/ScrollTopButton";

export default function Home() {
  return (
    <main className="bg-[#111111] text-white min-h-screen relative">

      <Navbar />

      <HeroSection />

      {/* The Seamless Dark Fade (The Content Workspace) */}
      <div id="poll" className="bg-[#111111] relative z-20">

        {/* Community Poll Header Area */}
        <section className="max-w-7xl mx-auto px-6 pt-16">
          <CommunityPoll />
        </section>

        {/* Trending Movies carousel */}
        <TrendingSection />

        {/* Dynamic Movie & OTT Feed Grid */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6">
            <span className="text-red-500 text-xs uppercase tracking-widest font-bold block mb-1">
              ⚡ Cinema Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Latest Industry Updates
            </h2>
          </div>
          <MovieFeed />
        </section>

        {/* Latest Community Reviews */}
        <HomeReviewsSection />

      </div>

      <Footer />

      <ScrollTopButton />

    </main>
  );
}