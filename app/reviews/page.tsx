import { supabase } from "../lib/supabase";

async function getReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

export default async function ReviewsPage() {

  const reviews = await getReviews();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Community Reviews
        </h1>

        <div className="space-y-6">

          {/* Empty State */}
          {reviews.length === 0 && (
            <div className="text-center py-20">

              <h2 className="text-3xl font-bold mb-4">
                No Reviews Yet
              </h2>

              <p className="text-zinc-500">
                Be the first person to review a movie.
              </p>

            </div>
          )}

          {/* Reviews */}
          {reviews.map((review: any) => (
            <a
              key={review.id}
              href={`/movie/${review.movie_id}`}
              className="flex gap-5 border border-zinc-800 rounded-xl p-5 hover:border-red-500 transition bg-zinc-950/40 backdrop-blur-md"
            >

              {/* Poster */}
              {review.poster_path ? (

                <img
                  src={`https://image.tmdb.org/t/p/w200${review.poster_path}`}
                  alt={review.movie_title}
                  className="w-24 h-36 rounded-lg object-cover"
                />

              ) : (

                <div className="w-24 h-36 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 text-xs text-center p-2">
                  No Poster
                </div>

              )}

              {/* Content */}
              <div className="flex-1">

                <div className="flex justify-between items-start mb-3">

                  <div>

                    <h2 className="text-xl font-bold">
                      {review.movie_title}
                    </h2>

                    <p className="text-zinc-500 text-sm">
                      {new Date(review.created_at).toLocaleString()}
                    </p>

                  </div>

                  {/* Stars */}
                  <div className="flex text-yellow-400 text-xl">

                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {review.rating >= star ? "★" : "☆"}
                      </span>
                    ))}

                  </div>

                </div>

                <p className="text-zinc-300 leading-relaxed">
                  {review.review_text}
                </p>

              </div>

            </a>
          ))}

        </div>

      </div>

    </main>
  );
}