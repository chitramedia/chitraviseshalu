import { supabase } from "../lib/supabase";

async function getReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("id", { ascending: false });

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

          {reviews.map((review: any) => (
            <a
              key={review.id}
              href={`/movie/${review.movie_id}`}
              className="block border border-zinc-800 rounded-xl p-6 hover:border-red-500 transition"
            >

              <div className="flex justify-between mb-4">

                <div>

                  <p className="font-semibold text-lg">
                    Anonymous User
                  </p>

                  <p className="text-red-500 text-sm font-medium">
                    {review.movie_title}
                  </p>

                </div>

                <div className="text-yellow-400 font-bold">
                  {review.rating} ⭐
                </div>

              </div>

              <p className="text-zinc-300 leading-relaxed">
                {review.review_text}
              </p>

            </a>
          ))}

        </div>

      </div>

    </main>
  );
}