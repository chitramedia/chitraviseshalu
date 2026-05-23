import { NextResponse } from "next/server";

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({
        results: [],
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      results: [],
    });
  }
}