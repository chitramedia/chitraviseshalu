"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

interface ReviewItem {
  id: string;
  movie_id: string;
  movie_title: string;
  poster_path: string;
  rating: number;
  review_text: string;
  user_email: string;
  created_at: string;
}

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: "fb-1",
    movie_id: "823464", // Godzilla x Kong
    movie_title: "Godzilla x Kong: The New Empire",
    poster_path: "/bEk92qn4TTgUvIS2IS8654G4D7e.jpg",
    rating: 4,
    review_text: "Absolute monster showdown! Visuals and audio are spectacular in IMAX. Plot is simple but action delivers completely.",
    user_email: "vamsi_cine@gmail.com",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
  },
  {
    id: "fb-2",
    movie_id: "939243",
    movie_title: "Kalki 2898 AD",
    poster_path: "/x2224A.jpg", // fallback poster will be managed or skipped
    rating: 5,
    review_text: "Pure epic scale! The mythological connection is brilliant. Amitabh Bachchan stands out as Ashwatthama.",
    user_email: "praveen_k@yahoo.com",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
];

export default function HomeReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    fetchLatestReviews();
  }, []);

  const fetchLatestReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2);

      if (error || !data || data.length === 0) {
        setReviews(FALLBACK_REVIEWS);
      } else {
        setReviews(data);
      }
    } catch {
      setReviews(FALLBACK_REVIEWS);
    }
  };

  const parseText = (text: string) => {
    if (text.startsWith("{\"")) {
      try {
        return JSON.parse(text).text;
      } catch {}
    }
    return text;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-red-500 text-xs uppercase tracking-widest font-bold block mb-1">
            💬 Vox Populi
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Latest Community Reviews
          </h2>
        </div>
        <Link
          href="/reviews"
          className="text-zinc-400 hover:text-white transition text-xs font-bold uppercase tracking-wider bg-zinc-950 border border-zinc-900 px-4 py-2.5 rounded-xl"
        >
          Explore All reviews →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <Link
            key={rev.id}
            href={`/movie/${rev.movie_id}`}
            className="block group bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 rounded-3xl p-6 hover:-translate-y-1 transition duration-300 relative overflow-hidden"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-white group-hover:text-red-500 transition line-clamp-1">
                  {rev.movie_title}
                </h3>
                <span className="text-[10px] text-red-500 font-bold block">
                  By: {rev.user_email?.split("@")[0] || "Cinephile"}
                </span>
              </div>

              <div className="flex text-yellow-400 text-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>{rev.rating >= star ? "★" : "☆"}</span>
                ))}
              </div>
            </div>

            <p className="text-zinc-400 text-xs md:text-sm mt-4 line-clamp-3 leading-relaxed">
              "{parseText(rev.review_text)}"
            </p>

            <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-4 border-t border-zinc-900/60 mt-4">
              <span>📅 {new Date(rev.created_at).toLocaleDateString()}</span>
              <span className="text-red-500/80 font-semibold group-hover:text-red-500 transition">
                Read full breakdown →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
