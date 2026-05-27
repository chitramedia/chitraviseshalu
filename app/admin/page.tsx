"use client";

import { useEffect, useState } from "react";
import { supabase, getSessionUser } from "../lib/supabase";
import { saveNewsArticle, getNewsArticles, NewsArticle, deleteNewsArticle } from "../lib/newsData";
import BackButton from "../components/BackButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { useToast } from "../components/Toast";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Form states
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSummary, setNewsSummary] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsImage, setNewsImage] = useState("");
  const [newsCategory, setNewsCategory] = useState<any>("Tollywood");
  const [newsStatus, setNewsStatus] = useState<"published" | "draft" | "scheduled">("published");
  const [newsPublishedAt, setNewsPublishedAt] = useState("");

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Tab views
  const [activeFormTab, setActiveFormTab] = useState<"edit" | "preview">("edit");

  // Moderation & Analytics states
  const [reviews, setReviews] = useState<any[]>([]);
  const [articlesList, setArticlesList] = useState<NewsArticle[]>([]);
  const [announcement, setAnnouncement] = useState("");

  const categories = ["Tollywood", "Bollywood", "Hollywood", "OTT", "Box Office", "Reviews"];

  useEffect(() => {
    fetchAdminStatus();
    // Default publishedAt to current datetime
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setNewsPublishedAt(now.toISOString().slice(0, 16));
  }, []);

  const fetchAdminStatus = async () => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("mock") === "true") {
        const mockUser = {
          id: "mock-user-12345",
          email: "admin@chitraviseshalu.com",
        } as any;
        setUser(mockUser);
        setIsAdmin(true);
        fetchModerationData();
        setLoading(false);
        return;
      }
    }

    const user = await getSessionUser();
    setUser(user);

    if (typeof document !== "undefined") {
      document.title = "Admin Dashboard | Chitra Viseshalu";
    }

    if (user) {
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

    // Load current articles (including drafts and scheduled posts)
    const articles = await getNewsArticles(true);
    setArticlesList(articles);

    // Load announcement
    const storedAnn = localStorage.getItem("chitra_featured_announcement");
    if (storedAnn) {
      setAnnouncement(storedAnn);
    }
  };

  // Rich Text Editor Injector
  const insertFormatting = (before: string, after: string = "") => {
    const textarea = document.getElementById("newsContent") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;
    setNewsContent(text.substring(0, start) + replacement + text.substring(end));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  // Simulated Image Uploading
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      const cinematicImages = [
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80"
      ];
      const randomImage = cinematicImages[Math.floor(Math.random() * cinematicImages.length)];
      setNewsImage(randomImage);
      setIsUploading(false);
      showToast("Simulated upload successful! Applied a cinematic cover image.", "success");
    }, 1200);
  };

  const handleCreateOrUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newsTitle.trim() || !newsContent.trim()) {
      showToast("Title and content are required.", "error");
      return;
    }

    setIsSubmitting(true);

    const slug = editingArticleId || newsTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newArticle: NewsArticle = {
      id: slug,
      title: newsTitle,
      summary: newsSummary || newsContent.substring(0, 120) + "...",
      content: newsContent,
      image: newsImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      category: newsCategory,
      publishedAt: newsPublishedAt ? new Date(newsPublishedAt).toISOString() : new Date().toISOString(),
      readTime: "3 min read", // calculated on runtime in newsData
      status: newsStatus,
      author: {
        name: user?.email?.split("@")[0] || "Administrator",
        role: "Chief Editor",
        avatar: "👑",
      },
    };

    try {
      await saveNewsArticle(newArticle);
      showToast(editingArticleId ? "News article updated successfully!" : "News article published successfully!", "success");

      // Clear/Reset Form
      handleCancelEdit();
      fetchModerationData();
    } catch (err: any) {
      showToast(`Failed to save news article: ${err.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditArticle = (art: NewsArticle) => {
    setEditingArticleId(art.id);
    setNewsTitle(art.title);
    setNewsSummary(art.summary || "");
    setNewsContent(art.content);
    setNewsImage(art.image);
    setNewsCategory(art.category);
    setNewsStatus(art.status || "published");
    if (art.publishedAt) {
      const d = new Date(art.publishedAt);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      setNewsPublishedAt(d.toISOString().slice(0, 16));
    }
    setActiveFormTab("edit");
    showToast(`Editing: "${art.title}"`, "info");
  };

  const handleCancelEdit = () => {
    setEditingArticleId(null);
    setNewsTitle("");
    setNewsSummary("");
    setNewsContent("");
    setNewsImage("");
    setNewsCategory("Tollywood");
    setNewsStatus("published");
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setNewsPublishedAt(now.toISOString().slice(0, 16));
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteNewsArticle(id);
        showToast("News article deleted.", "info");
        fetchModerationData();
      } catch (err: any) {
        showToast(`Failed to delete: ${err.message}`, "error");
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review from the feed?")) {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) {
        showToast(`Failed to delete review: ${error.message}`, "error");
      } else {
        showToast("Review deleted successfully.", "success");
        fetchModerationData();
      }
    }
  };

  const handleSaveAnnouncement = () => {
    localStorage.setItem("chitra_featured_announcement", announcement);
    showToast("Featured banner updated!", "success");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("announcementUpdate"));
    }
  };

  // Analytics helper calculations
  const totalArticles = articlesList.length;
  const draftCount = articlesList.filter(a => a.status === "draft").length;
  const scheduledCount = articlesList.filter(a => a.status === "scheduled").length;
  const totalViews = articlesList.reduce((acc, a) => acc + (a.viewsCount || 0), 0);
  
  const trendingArticles = [...articlesList]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
          <div className="text-center space-y-6 max-w-sm bg-[#1A1A1A] border border-zinc-800/30 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <span className="text-6xl block">⛔</span>
            <h1 className="text-3xl font-black">Access Denied</h1>
            <p className="text-zinc-400 text-sm">
              You must be logged in to access the administrator dashboard.
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-white hover:bg-zinc-200 text-[#111111] font-bold px-6 py-3.5 rounded-full transition shadow-md"
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

      <main className="min-h-screen bg-[#111111] text-white px-4 md:px-6 pt-28 pb-16">
        <div className="max-w-7xl mx-auto space-y-10">
          <BackButton />

          <header className="space-y-2">
            <span className="text-white/60 font-bold text-xs uppercase tracking-wider">
              Control Panel
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Chitra Cinema CMS
            </h1>
            <p className="text-zinc-400 text-sm">
              Manage cinema updates, draft previews, schedule publishing, and view platform metrics.
            </p>
          </header>

          {/* Analytics Overview Metrics (Growth & Performance) */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 rounded-2xl shadow-sm space-y-1">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Articles</span>
              <p className="text-3xl font-black text-white">{totalArticles}</p>
            </div>
            <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 rounded-2xl shadow-sm space-y-1">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Active Drafts</span>
              <p className="text-3xl font-black text-amber-500">{draftCount}</p>
            </div>
            <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 rounded-2xl shadow-sm space-y-1">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Scheduled Posts</span>
              <p className="text-3xl font-black text-sky-500">{scheduledCount}</p>
            </div>
            <div className="bg-[#1A1A1A] border border-zinc-800/30 p-6 rounded-2xl shadow-sm space-y-1">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Accumulated Views</span>
              <p className="text-3xl font-black text-emerald-500">{totalViews.toLocaleString()}</p>
            </div>
          </section>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Left Column: Form & Moderation lists */}
            <div className="space-y-10">
              
              {/* News Creator Form (Upgraded Mini CMS) */}
              <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    {editingArticleId ? "✏️ Edit Movie Article" : "📝 Compose Cinema Update"}
                  </h2>
                  <div className="flex bg-[#111111]/80 p-1 rounded-xl border border-zinc-800/40">
                    <button
                      onClick={() => setActiveFormTab("edit")}
                      className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition duration-200 ${
                        activeFormTab === "edit" ? "bg-white text-[#111111] font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Compose
                    </button>
                    <button
                      onClick={() => setActiveFormTab("preview")}
                      className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition duration-200 ${
                        activeFormTab === "preview" ? "bg-white text-[#111111] font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {activeFormTab === "edit" ? (
                  <form onSubmit={handleCreateOrUpdateArticle} className="space-y-5">
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
                          className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white text-white transition"
                        />
                      </div>
                      
                      {/* Image Thumbnail and Simulated Upload */}
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                          Cover Image URL or Upload
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={newsImage}
                            onChange={(e) => setNewsImage(e.target.value)}
                            className="flex-1 bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white text-white transition"
                          />
                          <label className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-4 py-3 rounded-xl cursor-pointer flex items-center justify-center transition border border-zinc-800/60 flex-shrink-0">
                            {isUploading ? "Uploading..." : "📷 Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                        </div>
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
                          className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white text-white transition cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Content Status (Draft, Scheduled, Published) */}
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                          Publication Status
                        </label>
                        <select
                          value={newsStatus}
                          onChange={(e) => setNewsStatus(e.target.value as any)}
                          className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white text-white transition cursor-pointer"
                        >
                          <option value="published">Published (Live)</option>
                          <option value="draft">Draft (Private)</option>
                          <option value="scheduled">Scheduled (Future)</option>
                        </select>
                      </div>

                      {/* Scheduled Time Pick */}
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                          Scheduled Release Date/Time
                        </label>
                        <input
                          type="datetime-local"
                          value={newsPublishedAt}
                          onChange={(e) => setNewsPublishedAt(e.target.value)}
                          className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white text-white transition cursor-pointer"
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
                        className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white text-white transition"
                      />
                    </div>

                    {/* Rich text editor toolbar & Textarea */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                          Article Content
                        </label>
                        
                        {/* Formatting Tool buttons */}
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => insertFormatting("**", "**")}
                            className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 px-2 py-1 rounded text-xs text-zinc-300 font-bold hover:text-white"
                            title="Bold"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("*", "*")}
                            className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 px-2 py-1 rounded text-xs text-zinc-300 italic hover:text-white"
                            title="Italic"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("### ", "")}
                            className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 px-2 py-1 rounded text-xs text-zinc-300 hover:text-white"
                            title="Heading 3"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("1. ", "")}
                            className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 px-2 py-1 rounded text-xs text-zinc-300 hover:text-white"
                            title="Numbered List"
                          >
                            List
                          </button>
                        </div>
                      </div>

                      <textarea
                        id="newsContent"
                        placeholder="Write your rich article content here... (Supports Markdown tags like **bold** or *italics*)"
                        value={newsContent}
                        onChange={(e) => setNewsContent(e.target.value)}
                        required
                        rows={8}
                        className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl p-4 text-sm focus:outline-none focus:border-white text-white transition resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-white hover:bg-zinc-200 text-[#111111] font-bold px-8 py-3.5 rounded-full text-sm transition shadow-md disabled:opacity-50"
                      >
                        {isSubmitting ? "Processing..." : editingArticleId ? "Update Article" : "Publish Article"}
                      </button>
                      {editingArticleId && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3.5 rounded-full text-sm transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  // CMS Live Draft Preview Pane
                  <div className="space-y-6">
                    <div className="relative h-48 rounded-2xl overflow-hidden border border-zinc-800/40">
                      <img
                        src={newsImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"}
                        alt="Preview cover"
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="bg-[#1A1A1A]/90 border border-zinc-850 px-2 py-0.5 rounded text-[10px] text-zinc-350 uppercase tracking-widest font-black">
                          {newsCategory}
                        </span>
                        <h3 className="text-2xl font-black mt-2 text-white">
                          {newsTitle || "Untitled Article Title"}
                        </h3>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-500 flex gap-4">
                      <span>Status: <strong className="text-zinc-300 uppercase">{newsStatus}</strong></span>
                      <span>Scheduled: <strong>{newsPublishedAt ? new Date(newsPublishedAt).toLocaleString() : "Now"}</strong></span>
                    </div>

                    <div className="border-t border-zinc-800/40 pt-4 prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4">
                      {newsContent ? (
                        newsContent.split("\n\n").map((para, i) => {
                          if (para.startsWith("### ")) {
                            return <h4 key={i} className="text-lg font-black text-white pt-2">{para.replace("### ", "")}</h4>;
                          }
                          let formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                          formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
                          return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
                        })
                      ) : (
                        <p className="text-zinc-500 italic">No content written yet. Form options will preview here.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Review Moderation Panel */}
              <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
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
                        className="p-4 bg-[#111111]/85 border border-zinc-800/40 rounded-2xl flex justify-between gap-4 items-start hover:border-zinc-750 transition"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-white">{rev.movie_title}</span>
                            <span className="text-yellow-450 text-xs font-semibold">
                              {rev.rating} ★
                            </span>
                          </div>
                          <span className="text-[10px] text-white/60 block">
                            By: {rev.user_email} &bull; {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                          <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                            {rev.review_text.startsWith("{\"") ? JSON.parse(rev.review_text).text : rev.review_text}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/50 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition flex-shrink-0"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Trending stats, News Manager & Banners */}
            <div className="space-y-8">
              
              {/* Site Announcement Widget */}
              <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <h3 className="text-lg font-black text-white">Featured Banner Announcement</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Update the marquee announcement shown on the homepage hero banner.
                </p>
                <textarea
                  placeholder="E.g., Alert: Pushpa 2 booking starts in Hyderabad! Get ready..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  rows={2}
                  className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl p-3 text-sm focus:outline-none focus:border-white text-white transition resize-none"
                />
                <button
                  onClick={handleSaveAnnouncement}
                  className="w-full bg-[#111111] hover:bg-[#1A1A1A] text-white border border-zinc-800/60 hover:border-white/20 text-xs font-semibold py-2.5 rounded-full transition"
                >
                  Save Announcement
                </button>
              </div>

              {/* Trending Stats Panel */}
              <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <h3 className="text-lg font-black text-white">📈 Trending Updates</h3>
                <div className="space-y-3">
                  {trendingArticles.length === 0 ? (
                    <p className="text-zinc-500 text-xs italic">No views registered yet.</p>
                  ) : (
                    trendingArticles.map((art, index) => (
                      <div key={art.id} className="flex justify-between items-center text-xs border-b border-zinc-850 pb-2">
                        <div className="space-y-0.5 truncate pr-2">
                          <span className="text-zinc-550 block font-bold uppercase text-[9px]">{art.category}</span>
                          <span className="font-bold text-zinc-350 truncate block">{art.title}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-extrabold text-emerald-500">{art.viewsCount || 0}</span>
                          <span className="text-zinc-500 text-[10px] block">views</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* News Articles Manager list */}
              <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <h3 className="text-lg font-black text-white">Manage News Stories ({articlesList.length})</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {articlesList.map((art) => (
                    <div
                      key={art.id}
                      className="p-3 bg-[#111111]/60 border border-zinc-800/40 rounded-xl flex items-center justify-between gap-3 hover:border-zinc-700 transition"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img src={art.image} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                        <div className="truncate">
                          <span className="text-xs font-semibold text-zinc-300 truncate block">{art.title}</span>
                          <span className="text-[10px] text-zinc-500 uppercase block font-bold">
                            {art.status || "published"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditArticle(art)}
                          className="text-white/60 hover:text-white text-xs px-2 py-1.5 hover:bg-white/10 rounded-lg transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="text-red-500/70 hover:text-red-500 text-xs px-2 py-1.5 hover:bg-red-500/10 rounded-lg transition"
                        >
                          Del
                        </button>
                      </div>
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
