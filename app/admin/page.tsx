"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { saveNewsArticle, getNewsArticles, NewsArticle, deleteNewsArticle } from "../lib/newsData";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSummary, setNewsSummary] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsCategory, setNewsCategory] = useState<any>("Tollywood");
  const [newsReadTime, setNewsReadTime] = useState("3 min read");

  // Moderation state
  const [reviews, setReviews] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<NewsArticle[]>([]);
  const [announcement, setAnnouncement] = useState("");

  const categories = ["Tollywood", "Bollywood", "Hollywood", "OTT", "Box Office", "Reviews"];

  useEffect(() => {
    fetchAdminStatus();
  }, []);

  const fetchAdminStatus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    // Dynamic browser SEO title
    if (typeof document !== "undefined") {
      document.title = "Admin Dashboard | Chitra Viseshalu";
    }

    if (user) {
      // Simulate admin verification or allow override
      setIsAdmin(true);
      fetchModerationData();
    }
    setLoading(false);
  };

  const fetchModerationData = async () => {
    // Load reviews for moderation
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    
    setReviews(data || []);

    // Load current articles
    setArticlesList(getNewsArticles());

    // Load announcement
    const storedAnn = localStorage.getItem("chitra_featured_announcement");
    if (storedAnn) {
      setAnnouncement(storedAnn);
    }
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newsTitle.trim() || !newsContent.trim()) {
      alert("Title and content are required.");
      return;
    }

    const newArticle: NewsArticle = {
      id: newsTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: newsTitle,
      summary: newsSummary || newsContent.substring(0, 120) + "...",
      content: newsContent,
      image: newsImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      category: newsCategory,
      publishedAt: new Date().toISOString(),
      readTime: newsReadTime,
      author: {
        name: user?.email?.split("@")[0] || "Administrator",
        role: "Chief Editor",
        avatar: "👑",
      },
    };

    saveNewsArticle(newArticle);
    alert("News article published successfully!");

    // Clear form
    setNewsTitle("");
    setNewsSummary("");
    setNewsContent("");
    setNewsImage("");
    fetchModerationData();
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteNewsArticle(id);
      fetchModerationData();
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review from the feed?")) {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) {
        alert(`Failed to delete review: ${error.message}`);
      } else {
        alert("Review deleted successfully.");
        fetchModerationData();
      }
    }
  };

  const handleSaveAnnouncement = () => {
    localStorage.setItem("chitra_featured_announcement", announcement);
    alert("Featured announcement saved!");
    // Trigger global storage update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("announcementUpdate"));
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-sm">
            <span className="text-6xl block">⛔</span>
            <h1 className="text-3xl font-black">Access Denied</h1>
            <p className="text-zinc-500 text-sm">
              You must be logged in to access the administrator dashboard.
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg"
            >
              Log In
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white px-4 md:px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-10">
          <BackButton />

          <header className="space-y-2">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
              Control Panel
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Admin Content Tools</h1>
            <p className="text-zinc-500 text-sm">
              Manage cinema updates, moderate reviews, and set featured banners for Chitra Viseshalu.
            </p>
          </header>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Left Column: Form & Moderation lists */}
            <div className="space-y-10">
              {/* News Creator Form */}
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  📝 Publish Movie News
                </h2>

                <form onSubmit={handleCreateArticle} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                        Headline Title
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., SSMB29 Shoot Set to Begin"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-white transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                        Cover Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={newsImage}
                        onChange={(e) => setNewsImage(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                        Category
                      </label>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-white transition cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                        Read Duration
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., 4 min read"
                        value={newsReadTime}
                        onChange={(e) => setNewsReadTime(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                      Brief Summary
                    </label>
                    <input
                      type="text"
                      placeholder="One-line summary for cards and search snippets"
                      value={newsSummary}
                      onChange={(e) => setNewsSummary(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                      Article Content (Use double line breaks for paragraphs)
                    </label>
                    <textarea
                      placeholder="Write your rich article content..."
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      required
                      rows={6}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-red-500 text-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  >
                    Publish News Article
                  </button>
                </form>
              </div>

              {/* Review Moderation Panel */}
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  🛡️ Review Moderation Panel ({reviews.length})
                </h2>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {reviews.length === 0 ? (
                    <p className="text-zinc-500 text-sm italic">No user reviews found to moderate.</p>
                  ) : (
                    reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-2xl flex justify-between gap-4 items-start"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-white">{rev.movie_title}</span>
                            <span className="text-yellow-400 text-xs font-semibold">
                              {rev.rating} ★
                            </span>
                          </div>
                          <span className="text-[10px] text-red-500 block">
                            By: {rev.user_email} &bull; {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                          <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                            {rev.review_text.startsWith("{\"") ? JSON.parse(rev.review_text).text : rev.review_text}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="bg-red-900/20 hover:bg-red-950/40 border border-red-900/50 hover:border-red-500 text-red-400 hover:text-red-300 p-2 rounded-xl text-xs transition flex-shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: News Manager & Banners */}
            <div className="space-y-8">
              {/* Site Announcement Widget */}
              <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-900 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-black text-white">Featured Banner Announcement</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Update the marquee announcement shown on the homepage hero banner.
                </p>
                <textarea
                  placeholder="E.g., Alert: Pushpa 2 booking starts in Hyderabad! Get ready..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500 text-white transition"
                />
                <button
                  onClick={handleSaveAnnouncement}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2.5 rounded-xl border border-zinc-700 transition"
                >
                  Save Announcement
                </button>
              </div>

              {/* News Articles Manager list */}
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-black text-white">Manage News Stories ({articlesList.length})</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {articlesList.map((art) => (
                    <div
                      key={art.id}
                      className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={art.image} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                        <span className="text-xs font-semibold text-zinc-300 truncate">{art.title}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="text-red-500 hover:text-red-400 text-xs px-2.5 py-1.5 hover:bg-red-500/10 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
