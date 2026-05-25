import { Metadata } from "next";
import NewsList from "../components/NewsList";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Latest Cinema News & Box Office Updates | Chitra Viseshalu",
  description: "Stay updated with the latest Tollywood, Bollywood, and Hollywood cinema news, reviews, box office numbers, and upcoming OTT release schedules on Chitra Viseshalu.",
  openGraph: {
    title: "Latest Cinema News & Box Office Updates | Chitra Viseshalu",
    description: "Stay updated with the latest movie news, box office trends, and OTT releases.",
    type: "website",
    url: "https://chitraviseshalu.com/news",
  },
};

export default function NewsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "Chitra Viseshalu News",
    "url": "https://chitraviseshalu.com/news",
    "description": "Latest Tollywood, Bollywood, and Hollywood cinema news and box office reports.",
    "sameAs": []
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="min-h-screen bg-[#111111] text-white px-4 md:px-6 pt-28 pb-16">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <header className="text-center max-w-3xl mx-auto space-y-4">
            <p className="uppercase tracking-[0.25em] text-white/60 font-bold text-xs">
              Cinema Hub
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              News & Updates
            </h1>
            <p className="text-zinc-450 text-sm md:text-base leading-relaxed">
              Explore breaking entertainment stories, box office updates, industry gossip, and exclusive sneak peeks straight from the heart of the film industry.
            </p>
          </header>

          {/* Main Feed Section */}
          <section aria-label="Cinema news updates feed">
            <NewsList />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
