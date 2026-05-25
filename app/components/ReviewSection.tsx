"use client";

import { useEffect, useState } from "react";
import { supabase, getSessionUser } from "../lib/supabase";

type Props = {
  movieId: string;
  movieTitle: string;
  posterPath: string;
};

type Review = {
  id: string;
  review_text: string;
  rating: number;
  created_at: string;
  movie_title: string;
  poster_path: string;
  user_email: string;
};

interface ReviewData {
  text: string;
  criteria?: {
    story: number;
    acting: number;
    direction: number;
    music: number;
    visuals: number;
  };
}

function parseReviewText(text: string): ReviewData {
  if (text && text.trim().startsWith("{\"text\":") || text && text.trim().startsWith("{\"reviewText\":")) {
    try {
      const parsed = JSON.parse(text);
      return {
        text: parsed.text || parsed.reviewText,
        criteria: parsed.criteria || parsed.breakdown
      };
    } catch {
      return { text };
    }
  }
  return { text };
}

export default function ReviewSection({
  movieId,
  movieTitle,
  posterPath,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // Ratings breakdown states
  const [showDetailed, setShowDetailed] = useState(false);
  const [storyRating, setStoryRating] = useState(5);
  const [actingRating, setActingRating] = useState(5);
  const [directionRating, setDirectionRating] = useState(5);
  const [musicRating, setMusicRating] = useState(5);
  const [visualsRating, setVisualsRating] = useState(5);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  // Recalculate average rating if detailed rating changes
  useEffect(() => {
    if (showDetailed) {
      const avg = Math.round((storyRating + actingRating + directionRating + musicRating + visualsRating) / 5);
      setRating(avg);
    }
  }, [storyRating, actingRating, directionRating, musicRating, visualsRating, showDetailed]);

  const submitReview = async () => {
    const user = await getSessionUser();

    if (!user) {
      alert("Please login to submit a review");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please write a review");
      return;
    }

    setLoading(true);

    let finalReviewText = reviewText;

    if (showDetailed) {
      // Serialize the multi-criteria review
      const serialized = {
        text: reviewText,
        criteria: {
          story: storyRating,
          acting: actingRating,
          direction: directionRating,
          music: musicRating,
          visuals: visualsRating,
        },
      };
      finalReviewText = JSON.stringify(serialized);
    }

    const { error } = await supabase.from("reviews").insert([
      {
        movie_id: movieId,
        movie_title: movieTitle,
        poster_path: posterPath,
        review_text: finalReviewText,
        rating,
        user_email: user.email,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Review submitted successfully!");
    setReviewText("");
    setRating(5);
    setStoryRating(5);
    setActingRating(5);
    setDirectionRating(5);
    setMusicRating(5);
    setVisualsRating(5);
    setShowDetailed(false);
    fetchReviews();
  };

  return (
    <div className="mt-16 space-y-8 border-t border-zinc-800/30 pt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-black text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Community Reviews</h2>
        <span className="bg-[#1A1A1A] border border-zinc-800/30 px-3.5 py-1.5 rounded-xl text-xs text-zinc-400">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      {/* Review Submission Card */}
      <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 rounded-3xl space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <h3 className="font-bold text-lg text-white">Add Your Critique</h3>

        <div className="space-y-4">
          <textarea
            placeholder="Write your movie review here... What did you like or dislike?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-xl bg-[#111111]/85 border border-zinc-800/60 text-white placeholder-zinc-550 focus:outline-none focus:border-white transition text-sm leading-relaxed resize-none"
          />

          {/* Upgrade Choice */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDetailed(!showDetailed)}
              className={`text-xs px-4 py-2 rounded-xl border transition ${
                showDetailed
                  ? "bg-white/10 border-white text-white font-bold"
                  : "bg-[#111111]/60 border-zinc-800/40 text-zinc-400 hover:text-white"
              }`}
            >
              {showDetailed ? "✨ Simple Rating Mode" : "✨ Write Detailed Breakdown"}
            </button>
          </div>

          {/* Simple star rating */}
          {!showDetailed ? (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Overall Score: {rating}/5
              </span>
              <div className="flex gap-1.5 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition duration-150 transform hover:scale-110 ${
                      rating >= star ? "text-yellow-450" : "text-zinc-700"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Detailed Sliders
            <div className="bg-[#111111]/85 p-5 rounded-2xl border border-zinc-800/30 space-y-4 grid sm:grid-cols-2 gap-4">
              <div className="col-span-full pb-2 border-b border-zinc-800/40 flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Ratings Breakdown
                </span>
                <span className="text-xs bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-bold">
                  Computed Overall: {rating} ★
                </span>
              </div>

              {/* Story */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Screenplay & Story</span>
                  <span className="text-yellow-450">{storyRating} ★</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={storyRating}
                  onChange={(e) => setStoryRating(parseInt(e.target.value))}
                  className="w-full accent-white bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Acting */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Acting & Performances</span>
                  <span className="text-yellow-450">{actingRating} ★</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={actingRating}
                  onChange={(e) => setActingRating(parseInt(e.target.value))}
                  className="w-full accent-white bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Direction */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Direction & Cinematography</span>
                  <span className="text-yellow-450">{directionRating} ★</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={directionRating}
                  onChange={(e) => setDirectionRating(parseInt(e.target.value))}
                  className="w-full accent-white bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Music */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Music & Soundtrack</span>
                  <span className="text-yellow-450">{musicRating} ★</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={musicRating}
                  onChange={(e) => setMusicRating(parseInt(e.target.value))}
                  className="w-full accent-white bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>

              {/* Visuals */}
              <div className="space-y-1 sm:col-span-full">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Visual Effects / CGI</span>
                  <span className="text-yellow-450">{visualsRating} ★</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={visualsRating}
                  onChange={(e) => setVisualsRating(parseInt(e.target.value))}
                  className="w-full accent-white bg-zinc-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={submitReview}
              disabled={loading}
              className="bg-white hover:bg-zinc-200 disabled:opacity-50 text-[#111111] font-bold px-6 py-3.5 rounded-full text-sm transition duration-300 shadow-md"
            >
              {loading ? "Submitting Critique..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl text-zinc-400 italic text-sm shadow-md">
            No reviews yet. Be the first to express your thoughts!
          </div>
        ) : (
          reviews.map((item) => {
            const parsed = parseReviewText(item.review_text);

            return (
              <div
                key={item.id}
                className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-5 md:p-6 space-y-4 hover:border-white/10 transition duration-300 shadow-md"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {item.user_email ? item.user_email.split("@")[0] : "Anonymous Critic"}
                    </h4>
                    <span className="text-[10px] text-zinc-550 block mt-0.5">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex text-yellow-450 text-base">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>{item.rating >= star ? "★" : "☆"}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Show Criteria Breakdown if exists */}
                {parsed.criteria && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#111111]/60 p-3 rounded-xl border border-zinc-800/30 text-xs">
                    {parsed.criteria.story > 0 && (
                      <div>
                        <span className="text-zinc-500 block">Screenplay</span>
                        <span className="text-yellow-450 font-semibold">{parsed.criteria.story} ★</span>
                      </div>
                    )}
                    {parsed.criteria.acting > 0 && (
                      <div>
                        <span className="text-zinc-500 block">Acting</span>
                        <span className="text-yellow-450 font-semibold">{parsed.criteria.acting} ★</span>
                      </div>
                    )}
                    {parsed.criteria.direction > 0 && (
                      <div>
                        <span className="text-zinc-500 block">Direction</span>
                        <span className="text-yellow-450 font-semibold">{parsed.criteria.direction} ★</span>
                      </div>
                    )}
                    {parsed.criteria.music > 0 && (
                      <div>
                        <span className="text-zinc-500 block">Music</span>
                        <span className="text-yellow-450 font-semibold">{parsed.criteria.music} ★</span>
                      </div>
                    )}
                    {parsed.criteria.visuals > 0 && (
                      <div>
                        <span className="text-zinc-500 block">Visuals</span>
                        <span className="text-yellow-450 font-semibold">{parsed.criteria.visuals} ★</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-zinc-350 text-sm leading-relaxed whitespace-pre-line">
                  {parsed.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}