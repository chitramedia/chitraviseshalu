import { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import ReviewList from "../components/ReviewList";
import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Audience Reviews & Movie Ratings | Chitra Viseshalu",
  description: "Browse what cinema lovers are saying. Discover honest reviews, comprehensive star ratings, screenplay analyses, and discussions on latest films.",
  openGraph: {
    title: "Audience Reviews & Movie Ratings | Chitra Viseshalu",
    description: "Honest movie reviews and community ratings for latest theatrical and OTT releases.",
    type: "website",
    url: "https://chitraviseshalu.com/reviews",
  },
};

async function getReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  // JSON-LD Structured Data for User Reviews aggregate
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Chitra Viseshalu Audience Reviews Feed",
    "description": "Reviews and ratings submitted by the Chitra Viseshalu community.",
    "url": "https://chitraviseshalu.com/reviews"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="min-h-screen bg-[#111111] text-white px-4 md:px-6 pt-28 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <BackButton />
          </div>

          {/* Heading Section */}
          <header className="space-y-3">
            <p className="uppercase tracking-[0.2em] text-white/60 font-bold text-xs">
              Audience Speak
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Community Reviews & Feed
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
              Explore reactions from cinema fans, ratings breakdowns, and check out what movies are currently earning the community's applause.
            </p>
          </header>

          {/* Review List Wrapper */}
          <section aria-label="Review feed section">
            <ReviewList initialReviews={reviews} />
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}