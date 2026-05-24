import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { watchlist = [], reviews = [] } = await request.json();

    if (watchlist.length === 0 && reviews.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // --- GEMINI POWERED AI ENGINE ---
      const watchlistStr = watchlist.map((m: any) => m.movie_title).join(", ");
      const reviewsStr = reviews
        .map((r: any) => `"${r.movie_title}" (Rating: ${r.rating}/5. Review: ${r.review_text || "None"})`)
        .join("; ");

      const prompt = `You are a movie recommendation assistant. Analyze the user's movie profile and recommend 5 movies.
Watchlist: [${watchlistStr}]
Reviews: [${reviewsStr}]

Generate a JSON array of objects. Each object MUST have:
1. "title": The exact movie title.
2. "explanation": A highly personalized explanation of why this movie is recommended, referencing specific movies they watched, saved, or rated, explaining the thematic or stylistic similarities.

Return ONLY a valid JSON array. Do not include any markdown format like \`\`\`json. The output must start with [ and end with ]. Example:
[
  {
    "title": "Inception",
    "explanation": "Because you enjoyed the sci-fi elements of Interstellar and gave it a 5-star rating, you'll love Inception's complex dream-heist concept."
  }
]`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate content from Gemini");
      }

      const responseData = await response.json();
      const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      let parsedRecs: any[] = [];
      try {
        parsedRecs = JSON.parse(text);
      } catch (err) {
        console.error("JSON parsing error for Gemini output:", text, err);
        throw new Error("Failed to parse Gemini recommendations output");
      }

      // Now fetch details from TMDB for each recommended movie title
      const recommendations = await Promise.all(
        parsedRecs.map(async (rec: any) => {
          try {
            const searchRes = await fetch(
              `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(rec.title)}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!searchRes.ok) return null;
            const searchData = await searchRes.json();
            const movie = searchData.results?.[0];

            if (!movie) return null;

            return {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              overview: movie.overview,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              explanation: rec.explanation,
            };
          } catch (e) {
            console.error("Error searching TMDB for movie: " + rec.title, e);
            return null;
          }
        })
      );

      // Filter out nulls
      const validRecs = recommendations.filter(Boolean);
      return NextResponse.json({ recommendations: validRecs, source: "gemini" });
    } else {
      // --- LOCAL TMDB SIMILARITY FALLBACK ENGINE ---
      // Collect all source movies
      const sourceMovies = [
        ...watchlist.map((m: any) => ({
          id: m.movie_id,
          title: m.movie_title,
          isReview: false,
          rating: 0,
        })),
        ...reviews.map((r: any) => ({
          id: r.movie_id,
          title: r.movie_title,
          isReview: true,
          rating: r.rating,
        })),
      ];

      // Shuffle or slice to not call too many parallel TMDB queries
      const selectedSources = sourceMovies.slice(0, 5);

      const similarMoviesResults = await Promise.all(
        selectedSources.map(async (source: any) => {
          try {
            const simRes = await fetch(
              `https://api.themoviedb.org/3/movie/${source.id}/similar`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!simRes.ok) return [];
            const data = await simRes.json();
            return (data.results || []).map((movie: any) => ({
              ...movie,
              sourceMovie: source,
            }));
          } catch (e) {
            console.error("Error getting similar movies for ID: " + source.id, e);
            return [];
          }
        })
      );

      // Flatten recommendations
      const allSimilar = similarMoviesResults.flat();

      // Deduplicate and filter out movies already in profile
      const profileIds = new Set(sourceMovies.map((m) => String(m.id)));
      const seenIds = new Set<string>();
      const finalRecs: any[] = [];

      for (const movie of allSimilar) {
        const idStr = String(movie.id);
        if (profileIds.has(idStr) || seenIds.has(idStr)) {
          continue;
        }

        seenIds.add(idStr);

        const explanation = movie.sourceMovie.isReview
          ? `Because you gave "${movie.sourceMovie.title}" a rating of ${movie.sourceMovie.rating}/5, we recommend this similar title for its shared themes and viewer acclaim.`
          : `Because "${movie.sourceMovie.title}" is in your watchlist, you will likely appreciate this movie's storytelling and genre execution.`;

        finalRecs.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          explanation,
        });

        if (finalRecs.length >= 5) break;
      }

      return NextResponse.json({ recommendations: finalRecs, source: "tmdb-fallback" });
    }
  } catch (error: any) {
    console.error("Recommendations API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
