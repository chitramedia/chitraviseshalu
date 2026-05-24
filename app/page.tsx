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
    <main className="bg-black text-white min-h-screen space-y-6">

      <Navbar />

      <HeroSection />

      {/* Community Poll Header Area */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <CommunityPoll />
      </section>

      {/* Trending Movies carousel */}
      <TrendingSection />

      {/* Short Gossip Drops / Mini Content Posts */}
      <HomeNewsSection />

      {/* Latest Community Reviews */}
      <HomeReviewsSection />

      <Footer />

      <ScrollTopButton />

    </main>
  );
}