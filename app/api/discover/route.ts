import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mood = searchParams.get("mood");

    if (!mood || mood === "trending") {
      const response = await fetch("https://api.themoviedb.org/3/trending/movie/week", {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch trending movies");
      const data = await response.json();
      return NextResponse.json(data);
    }

    const urlParams = new URLSearchParams({
      include_adult: "false",
      include_video: "false",
      language: "en-US",
      page: "1",
      sort_by: "popularity.desc",
    });

    switch (mood) {
      case "mind-blowing":
        // Sci-Fi (878) & Mystery (9648)
        urlParams.append("with_genres", "878,9648");
        urlParams.append("vote_count.gte", "500");
        break;
      case "hidden-gem":
        // Highly rated, but not huge vote counts (between 100 and 1500)
        urlParams.append("vote_average.gte", "7.6");
        urlParams.append("vote_count.gte", "80");
        urlParams.append("vote_count.lte", "1200");
        break;
      case "thriller":
        // Thriller (53)
        urlParams.append("with_genres", "53");
        break;
      case "romance":
        // Romance (10749)
        urlParams.append("with_genres", "10749");
        break;
      case "anime":
        // Animation (16) + Japanese language
        urlParams.append("with_genres", "16");
        urlParams.append("with_original_language", "ja");
        break;
      case "k-dramas":
        // Korean language and Drama (18) genre
        urlParams.append("with_genres", "18");
        urlParams.append("with_original_language", "ko");
        break;
      case "action":
        // Action (28)
        urlParams.append("with_genres", "28");
        break;
      default:
        break;
    }

    const apiUrl = `https://api.themoviedb.org/3/discover/movie?${urlParams.toString()}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching discover data from TMDB:", error);
    return NextResponse.json({ results: [] });
  }
}
