export async function getTrendingMovies() {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/trending/movie/week",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Failed to fetch trending movies from TMDB:", error);
    // Return curated mock trending movies as fallback for offline development
    return [
      {
        id: 550,
        title: "Fight Club",
        poster_path: "/pB8gPxzzZURJgb57Z561Hwlz0Hb.jpg",
        backdrop_path: "/hZ3xJUQqmqsg4w4m4t4t3b3b4.jpg",
        vote_average: 8.4,
        release_date: "1999-10-15",
        overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy."
      },
      {
        id: 27205,
        title: "Inception",
        poster_path: "/o0O4Qq75R7tAFOcjMmTTv5A40a.jpg",
        backdrop_path: "/s3TBr7xVhuoEQQQQQQQQQQQQQQ.jpg",
        vote_average: 8.3,
        release_date: "2010-07-15",
        overview: "Cobb, a skilled thief who steals valuable secrets from deep within the subconscious during the dream state."
      },
      {
        id: 157336,
        title: "Interstellar",
        poster_path: "/gEU2QvIPwc30s5vHG9t7gaYYJmc.jpg",
        backdrop_path: "/xJHoknOd94XyokHQ8r9W41Fq9Z5.jpg",
        vote_average: 8.4,
        release_date: "2014-11-05",
        overview: "The adventures of a group of explorers who make use of a newly discovered wormhole."
      }
    ];
  }
}