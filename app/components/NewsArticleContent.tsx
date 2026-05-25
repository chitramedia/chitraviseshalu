"use client";

import { useState, useEffect } from "react";
import { NewsArticle } from "../lib/newsData";
import Link from "next/link";
import BackButton from "./BackButton";
import { supabase } from "../lib/supabase";

type Props = {
  article: NewsArticle;
};

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export default function NewsArticleContent({ article }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    // Load comments and bookmark status from local storage
    const storedComments = localStorage.getItem(`comments_${article.id}`);
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (e) {
        console.error(e);
      }
    }

    const bookmarks = localStorage.getItem("chitra_bookmarked_news");
    if (bookmarks) {
      try {
        const list = JSON.parse(bookmarks) as string[];
        setIsBookmarked(list.includes(article.id));
      } catch (e) {
        console.error(e);
      }
    }
  }, [article.id]);

  useEffect(() => {
    async function incrementView() {
      try {
        await supabase.rpc("increment_post_views_by_slug", { post_slug: article.id });
      } catch (err) {
        console.error("Failed to increment article view count:", err);
      }
    }
    incrementView();
  }, [article.id]);

  const toggleBookmark = () => {
    const bookmarks = localStorage.getItem("chitra_bookmarked_news");
    let list: string[] = [];
    if (bookmarks) {
      try {
        list = JSON.parse(bookmarks);
      } catch {}
    }

    if (isBookmarked) {
      list = list.filter((id) => id !== article.id);
      setIsBookmarked(false);
    } else {
      list.push(article.id);
      setIsBookmarked(true);
    }
    localStorage.setItem("chitra_bookmarked_news", JSON.stringify(list));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      author: authorName.trim() || "Anonymous Reader",
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_${article.id}`, JSON.stringify(updated));
    setCommentText("");
  };

  return (
    <article className="space-y-8">
      <div className="flex justify-between items-center">
        <BackButton />
        <div className="flex gap-2">
          <button
            onClick={toggleBookmark}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition duration-300 ${
              isBookmarked
                ? "bg-white/10 border-white text-white font-bold"
                : "bg-[#111111] hover:bg-[#1A1A1A] border-zinc-800/60 hover:border-white/20 text-zinc-400 hover:text-white"
            }`}
            title={isBookmarked ? "Remove from Saved Articles" : "Save Article"}
          >
            🔖 {isBookmarked ? "Saved" : "Save"}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-[#111111] hover:bg-[#1A1A1A] border border-zinc-800/60 hover:border-white/20 text-zinc-400 hover:text-white rounded-full text-xs font-semibold transition duration-300 flex items-center gap-2"
          >
            🔗 {shareSuccess ? "Copied!" : "Share Link"}
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="relative h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden border border-zinc-800/40 shadow-xl">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <span className="bg-[#1A1A1A] text-zinc-300 font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wider border border-zinc-800/50 shadow-md">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-3 leading-tight drop-shadow-md">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Author and Date Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#111111]/90 border border-zinc-800/30 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-xl border border-zinc-800/40">
            {article.author.avatar}
          </span>
          <div>
            <div className="font-bold text-white text-sm">{article.author.name}</div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{article.author.role}</div>
          </div>
        </div>
        <div className="text-xs text-zinc-400 flex items-center gap-4">
          <span>📅 {new Date(article.publishedAt).toLocaleDateString()}</span>
          <span>⏱️ {article.readTime}</span>
          {typeof article.viewsCount === "number" && article.viewsCount > 0 && (
            <span>👁️ {article.viewsCount.toLocaleString()} views</span>
          )}
        </div>
      </div>

      {/* Rich Body Content */}
      <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-base md:text-lg space-y-6">
        {article.content.split("\n\n").map((paragraph, index) => {
          if (paragraph.startsWith("### ")) {
            return (
              <h3 key={index} className="text-2xl font-bold text-white mt-8 mb-4 border-l-4 border-white pl-3">
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("1. ") || paragraph.startsWith("2. ") || paragraph.startsWith("3. ")) {
            return (
              <div key={index} className="pl-6 space-y-2 my-4 text-zinc-300">
                {paragraph.split("\n").map((li, i) => (
                  <p key={i} className="list-decimal pl-1">
                    {li}
                  </p>
                ))}
              </div>
            );
          }
          // render markdown bold
          let formatted = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
          return (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: formatted }}
              className="text-zinc-300"
            />
          );
        })}
      </div>

      {/* Newsletter Signup (Retention/Growth) */}
      <section className="p-8 rounded-3xl bg-[#1A1A1A] border border-zinc-800/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Never Miss a Cinematic Update!</h3>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Subscribe to the Chitra Viseshalu weekly digest. Get the latest movie updates, review rundowns, and recommendations delivered to your inbox.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you for subscribing!");
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email address"
            required
            className="flex-1 bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
          />
          <button
            type="submit"
            className="bg-white hover:bg-zinc-200 text-[#111111] font-bold px-6 py-3 rounded-full text-sm transition duration-300 shadow-md"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Comment Section (Engagement) */}
      <section className="space-y-6 pt-10 border-t border-zinc-800/30">
        <h3 className="text-2xl font-bold text-white">Discussion & Reaction ({comments.length})</h3>

        {/* Comment Form */}
        <form onSubmit={submitComment} className="space-y-4 p-6 rounded-3xl bg-[#1A1A1A] border border-zinc-800/30 shadow-md">
          <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Leave a Comment</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>
          <textarea
            placeholder="Write your reaction to this cinema news..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows={3}
            className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white resize-none leading-relaxed"
          />
          <button
            type="submit"
            className="bg-white hover:bg-zinc-200 text-[#111111] font-bold px-6 py-2.5 rounded-full text-sm transition duration-300 shadow-sm border-none"
          >
            Post Comment
          </button>
        </form>

        {/* Comment List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-zinc-500 text-sm italic">No reactions yet. Join the conversation and speak your mind!</p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-5 rounded-2xl bg-[#1A1A1A]/70 border border-zinc-800/30 space-y-2 hover:border-white/10 transition duration-300 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-white text-sm">{comment.author}</div>
                  <div className="text-xs text-zinc-505">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-zinc-350 text-sm leading-relaxed">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}
