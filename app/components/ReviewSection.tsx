"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  movieId: string;
};

type Review = {
  id: string;
  review_text: string;
  rating: number;
};

export default function ReviewSection({ movieId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("movie_id", movieId)
      .order("id", { ascending: false });

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
    if (!review) {
      alert("Please write a review");
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          movie_id: movieId,
            movie_title: document.title,
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

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="p-3 rounded bg-gray-900 border border-gray-700"
        >
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>

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
            <div className="flex justify-between mb-2">

              <h3 className="font-bold">
                Anonymous User
              </h3>

              <span>
                {item.rating} ⭐
              </span>

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