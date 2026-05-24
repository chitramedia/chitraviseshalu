"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Review = {
  id: string;
  movie_id: string;
  review_text: string;
  rating: number;
  created_at: string;
  movie_title: string;
  poster_path: string;
  user_email: string;
};

type Props = {
  initialReviews: Review[];
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

export default function ReviewList({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "highest" | "lowest">("latest");
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [votedList, setVotedList] = useState<string[]>([]);

  useEffect(() => {
    // Load upvotes and voting history from localStorage
    const storedUpvotes = localStorage.getItem("chitra_review_upvotes");
    const storedVoted = localStorage.getItem("chitra_voted_reviews");

    if (storedUpvotes) {
      try {
        setUpvotes(JSON.parse(storedUpvotes));
      } catch {}
    }
    if (storedVoted) {
      try {
        setVotedList(JSON.parse(storedVoted));
      } catch {}
    }
  }, []);

  const handleUpvote = (reviewId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let newVotedList = [...votedList];
    const newUpvotes = { ...upvotes };

    if (votedList.includes(reviewId)) {
      // Remove vote
      newVotedList = newVotedList.filter((id) => id !== reviewId);
      newUpvotes[reviewId] = Math.max(0, (newUpvotes[reviewId] || 0) - 1);
    } else {
      // Add vote
      newVotedList.push(reviewId);
      newUpvotes[reviewId] = (newUpvotes[reviewId] || 0) + 1;
    }

    setVotedList(newVotedList);
    setUpvotes(newUpvotes);
    localStorage.setItem("chitra_review_upvotes", JSON.stringify(newUpvotes));
    localStorage.setItem("chitra_voted_reviews", JSON.stringify(newVotedList));
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch =
        review.movie_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (review.user_email && review.user_email.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRating = ratingFilter === null || review.rating === ratingFilter;
      return matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      // Default latest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      {/* Review Hub Statistics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-950/60 p-6 rounded-3xl border border-zinc-900 backdrop-blur-md">
        <div className="text-center md:border-r border-zinc-900 py-2">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">Total Reviews</p>
          <p className="text-3xl font-extrabold text-white mt-1">{totalReviews}</p>
        </div>
        <div className="text-center md:border-r border-zinc-900 py-2">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">Average Score</p>
          <p className="text-3xl font-extrabold text-yellow-400 mt-1">★ {averageRating}</p>
        </div>
        <div className="text-center md:border-r border-zinc-900 py-2 col-span-2 md:col-span-2">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">Active Community Members</p>
          <p className="text-3xl font-extrabold text-red-500 mt-1">
            {Array.from(new Set(reviews.map((r) => r.user_email))).length}
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-zinc-950/40 p-5 rounded-2xl border border-zinc-900">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Search reviews by movie title or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition duration-300"
          />
          <span className="absolute left-3 top-3.5 text-zinc-500">🔍</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Star Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setRatingFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                ratingFilter === null ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              All Ratings
            </button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => setRatingFilter(stars)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  ratingFilter === stars ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                {stars} ★
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-red-500 cursor-pointer ml-auto lg:ml-0"
          >
            <option value="latest">Latest Reviews</option>
            <option value="highest">Highest Ratings</option>
            <option value="lowest">Lowest Ratings</option>
          </select>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-3xl">
            <span className="text-5xl block mb-4">✍️</span>
            <h3 className="text-2xl font-bold text-white mb-2">No Reviews Found</h3>
            <p className="text-zinc-500 text-sm">
              We couldn't find any reviews matching your current filters.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const parsed = parseReviewText(review.review_text);
            const reviewVotes = upvotes[review.id] || 0;
            const hasVoted = votedList.includes(review.id);

            return (
              <Link
                key={review.id}
                href={`/movie/${review.movie_id}`}
                className="block group bg-zinc-950/40 border border-zinc-900 hover:border-red-600/40 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(220,38,38,0.15)] transition duration-300 p-5 md:p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Poster / Side Column */}
                  <div className="flex md:flex-col items-center gap-4 md:items-start min-w-[100px]">
                    {review.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${review.poster_path}`}
                        alt={review.movie_title}
                        className="w-16 h-24 md:w-24 md:h-36 rounded-xl object-cover border border-zinc-800 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-24 md:w-24 md:h-36 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 text-xs text-center p-2 border border-zinc-800">
                        No Poster
                      </div>
                    )}
                  </div>

                  {/* Review Info / Right Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-red-500 transition leading-tight">
                          {review.movie_title}
                        </h3>
                        <p className="text-xs text-red-500 mt-1 font-semibold">
                          {review.user_email ? review.user_email.split("@")[0] : "Anonymous User"}
                        </p>
                        <p className="text-zinc-500 text-[10px] mt-0.5">
                          {new Date(review.created_at).toLocaleString()}
                        </p>
                      </div>

                      {/* Stars */}
                      <div className="flex flex-col items-end">
                        <div className="flex text-yellow-400 text-xl font-bold">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>{review.rating >= star ? "★" : "☆"}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Criteria Ratings Breakdown (Ratings System Upgrade) */}
                    {parsed.criteria && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-zinc-900/30 p-3.5 rounded-xl border border-zinc-900/80 text-xs">
                        {parsed.criteria.story > 0 && (
                          <div className="space-y-1">
                            <div className="text-zinc-500 font-semibold">Screenplay</div>
                            <div className="text-yellow-400 font-bold">★ {parsed.criteria.story}</div>
                          </div>
                        )}
                        {parsed.criteria.acting > 0 && (
                          <div className="space-y-1">
                            <div className="text-zinc-500 font-semibold">Acting</div>
                            <div className="text-yellow-400 font-bold">★ {parsed.criteria.acting}</div>
                          </div>
                        )}
                        {parsed.criteria.direction > 0 && (
                          <div className="space-y-1">
                            <div className="text-zinc-500 font-semibold">Direction</div>
                            <div className="text-yellow-400 font-bold">★ {parsed.criteria.direction}</div>
                          </div>
                        )}
                        {parsed.criteria.music > 0 && (
                          <div className="space-y-1">
                            <div className="text-zinc-500 font-semibold">Music</div>
                            <div className="text-yellow-400 font-bold">★ {parsed.criteria.music}</div>
                          </div>
                        )}
                        {parsed.criteria.visuals > 0 && (
                          <div className="space-y-1">
                            <div className="text-zinc-500 font-semibold">Visuals</div>
                            <div className="text-yellow-400 font-bold">★ {parsed.criteria.visuals}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review text */}
                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed break-words whitespace-pre-line">
                      {parsed.text}
                    </p>

                    {/* Review Interaction Footer */}
                    <div className="flex gap-4 items-center pt-3 border-t border-zinc-900/50">
                      <button
                        onClick={(e) => handleUpvote(review.id, e)}
                        className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl border transition ${
                          hasVoted
                            ? "bg-red-600/20 border-red-500 text-red-500"
                            : "bg-zinc-900/80 border-zinc-800 hover:border-red-500/50 text-zinc-400 hover:text-white"
                        }`}
                      >
                        👍 Helpful {reviewVotes > 0 && `(${reviewVotes})`}
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (typeof window !== "undefined") {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/movie/${review.movie_id}`
                            );
                            alert("Copied link to movie review!");
                          }
                        }}
                        className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded"
                      >
                        Share Review
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
