import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrendingSection from "./components/TrendingSection";
import Footer from "./components/Footer";
import ScrollTopButton from "./components/ScrollTopButton";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen">

      <Navbar />

      <HeroSection />

      <TrendingSection />

      <Footer />

      <ScrollTopButton />

    </main>
  );
}