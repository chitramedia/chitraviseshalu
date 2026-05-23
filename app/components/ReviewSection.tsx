"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
};

export default function ReviewSection({
  movieId,
  movieTitle,
  posterPath,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false });

    console.log("FETCH DATA:", data);
    console.log("FETCH ERROR:", error);

    if (!error && data) {
      setReviews(data);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitReview = async () => {
    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  alert("Please login to submit a review");
  return;
}
    if (!review) {
      alert("Please write a review");
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          movie_id: movieId,
          movie_title: movieTitle,
          poster_path: posterPath,
          review_text: review,
          rating,
        },
      ]);

    console.log("SUBMIT DATA:", data);
    console.log("SUBMIT ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Review submitted!");

    setReview("");
    setRating(5);

    fetchReviews();
  };

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-4">
        Community Reviews
      </h2>

      <div className="space-y-4 mb-6">

        <textarea
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 border border-gray-700"
        />

        {/* Interactive Star Rating */}
        <div className="flex gap-2 text-3xl">

          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transition ${
                rating >= star
                  ? "text-yellow-400"
                  : "text-zinc-600"
              }`}
            >
              ★
            </button>
          ))}

        </div>

        <button
          onClick={submitReview}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded font-semibold"
        >
          Submit Review
        </button>

      </div>

      <div className="space-y-4">

        {reviews.length === 0 && (
          <p className="text-gray-400">
            No reviews yet.
          </p>
        )}

        {reviews.map((item) => (
          <div
            key={item.id}
            className="border border-gray-800 rounded p-4"
          >

            <div className="flex justify-between items-center mb-2">

              <div>

                <h3 className="font-bold">
                  Anonymous User
                </h3>

                <p className="text-xs text-zinc-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>

              </div>

              {/* Review Stars */}
              <div className="flex text-yellow-400 text-xl">

                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {item.rating >= star ? "★" : "☆"}
                  </span>
                ))}

              </div>

            </div>

            <p className="text-gray-300">
              {item.review_text}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}