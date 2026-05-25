"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import PostCard, { Post } from "./PostCard";

const MOCK_POSTS: Post[] = [
  {
    id: "pushpa-2-trailer-release",
    title: "Pushpa 2: The Rule Trailer Sets New Record with 100M+ Views in 24 Hours",
    slug: "pushpa-2-trailer-release",
    summary: "Allu Arjun's highly anticipated action-thriller trailer has taken the internet by storm, shattering all previous Indian cinema trailer records.",
    content:
      "The storm has officially arrived. The trailer for Pushpa 2: The Rule, starring Icon Star Allu Arjun and Rashmika Mandanna, has rewritten YouTube history by crossing 100 million views within 24 hours of its release.\n\nDirected by Sukumar, the sequel promises to be larger-than-life, exploring the high-stakes clash between Pushpa Raj and SP Bhanwar Singh Shekhawat (played by Fahadh Faasil). Production values have seen a massive upgrade with spectacular visual effects, heavy-hitting dialogue, and a gripping score by Devi Sri Prasad.",
    image_url:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000",
    category: "Movie News",
    platform: "Theaters",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "devara-ott-release",
    title: "Devara: Part 1 Streaming Now on Netflix",
    slug: "devara-ott-release",
    summary:
      "Jr. NTR's blockbuster action drama Devara is now available for streaming on Netflix in multiple languages.",
    content:
      "Jr. NTR's high-voltage coastal action drama Devara: Part 1 is finally streaming after a blockbuster theatrical run. Co-starring Saif Ali Khan and Janhvi Kapoor, this film offers spectacular underwater battles and a solid mass experience.",
    image_url:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1000",
    category: "OTT Release",
    platform: "Netflix",
    streaming_url: "https://netflix.com",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ssmb29-updates",
    title: "SSMB29: SS Rajamouli & Mahesh Babu Film Set for African Forest Adventure",
    slug: "ssmb29-updates",
    summary:
      "SS Rajamouli's upcoming globetrotting forest adventure with Mahesh Babu to feature state-of-the-art Hollywood visual effects.",
    content:
      "The collaboration between mastermind SS Rajamouli and Superstar Mahesh Babu (SSMB29) is easily one of the most talked-about projects in Indian cinema. Writer KV Vijayendra Prasad confirmed that the script is fully locked and production prep is running at full steam.",
    image_url:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000",
    category: "Movie News",
    platform: "Theaters",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "game-changer-ott-prime",
    title: "Game Changer OTT Release: Ram Charan's Political Drama to Stream on Prime Video",
    slug: "game-changer-ott-prime",
    summary:
      "Director Shankar's political action drama Game Changer starring Ram Charan and Kiara Advani locks its streaming partner.",
    content:
      "Ram Charan's high-budget political drama Game Changer, directed by Shankar, has confirmed its digital rights deal. The film will stream on Amazon Prime Video post its theatrical release.",
    image_url:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000",
    category: "OTT Release",
    platform: "Prime Video",
    streaming_url: "https://amazon.com/primevideo",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export default function MovieFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        let query = supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (filter !== "All") {
          query = query.eq("category", filter);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          setPosts(data);
        } else {
          // Fallback to MOCK_POSTS
          const filteredMock =
            filter === "All"
              ? MOCK_POSTS
              : MOCK_POSTS.filter((p) => p.category === filter);
          setPosts(filteredMock);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        const filteredMock =
          filter === "All"
            ? MOCK_POSTS
            : MOCK_POSTS.filter((p) => p.category === filter);
        setPosts(filteredMock);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-550 space-y-4">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wider text-zinc-400">
          Loading cinema updates...
        </p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white min-h-screen">
      {/* Category Filter Navbar */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-3 scrollbar-none">
        {["All", "Movie News", "OTT Release", "Review", "Box Office"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                filter === cat
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                  : "bg-[#1A1A1A]/80 text-zinc-400 hover:text-white hover:bg-[#222222]/80 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 bg-[#1A1A1A]/40 border border-zinc-800/40 rounded-3xl">
          <span className="text-5xl block mb-4">🎬</span>
          <h3 className="text-xl font-black mb-2">No Updates Found</h3>
          <p className="text-zinc-550 text-sm">
            We couldn&apos;t find any updates in this category.
          </p>
        </div>
      ) : (
        <>
          {/* Big Featured Hero Post (Only on 'All' or first load) */}
          {filter === "All" && featuredPost && (
            <Link
              href={`/news/${featuredPost.slug || featuredPost.id}`}
              className="block relative rounded-3xl overflow-hidden mb-12 bg-[#1A1A1A]/80 group cursor-pointer border border-zinc-800 hover:border-zinc-700/80 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="md:flex">
                <div className="md:w-3/5 relative h-64 md:h-[420px] overflow-hidden bg-zinc-950">
                  <img
                    src={
                      featuredPost.image_url ||
                      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000"
                    }
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-red-650 text-[10px] font-black uppercase px-3.5 py-1 rounded-md tracking-wider border border-red-600/35">
                    {featuredPost.category}
                  </span>
                </div>
                <div className="p-8 md:p-10 md:w-2/5 flex flex-col justify-center bg-[#1A1A1A]/85 backdrop-blur-sm">
                  <span className="text-xs font-bold tracking-widest text-red-500 uppercase mb-3">
                    {featuredPost.platform}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-4 line-clamp-2 group-hover:text-red-500 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4 mb-6">
                    {featuredPost.summary || featuredPost.content}
                  </p>
                  <div className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">
                    {new Date(featuredPost.created_at).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Clean Grid Layout for the Rest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(filter === "All" ? remainingPosts : posts).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
