import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrendingSection from "./components/TrendingSection";
import HomeNewsSection from "./components/HomeNewsSection";
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

        {/* Short Gossip Drops / Mini Content Posts */}
        <HomeNewsSection />

        {/* Latest Community Reviews */}
        <HomeReviewsSection />

      </div>

      <Footer />

      <ScrollTopButton />

    </main>
  );
}