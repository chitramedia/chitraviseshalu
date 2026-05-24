"use client";

import { useState, useEffect } from "react";
import { NewsArticle } from "../lib/newsData";
import Link from "next/link";
import BackButton from "./BackButton";

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
            className={`p-3 rounded-xl border transition duration-300 ${
              isBookmarked
                ? "bg-red-600/20 border-red-500 text-red-500"
                : "bg-zinc-900 border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-white"
            }`}
            title={isBookmarked ? "Remove from Saved Articles" : "Save Article"}
          >
            🔖 {isBookmarked ? "Saved" : "Save"}
          </button>
          <button
            onClick={handleShare}
            className="p-3 bg-zinc-900 border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-white rounded-xl transition duration-300 flex items-center gap-2"
          >
            🔗 {shareSuccess ? "Copied!" : "Share Link"}
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="relative h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden border border-zinc-850">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wider shadow-lg">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-3 leading-tight drop-shadow-md">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Author and Date Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-xl">
            {article.author.avatar}
          </span>
          <div>
            <div className="font-bold text-white">{article.author.name}</div>
            <div className="text-xs text-zinc-500">{article.author.role}</div>
          </div>
        </div>
        <div className="text-sm text-zinc-400 flex items-center gap-4">
          <span>📅 {new Date(article.publishedAt).toLocaleDateString()}</span>
          <span>⏱️ {article.readTime}</span>
        </div>
      </div>

      {/* Rich Body Content */}
      <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-base md:text-lg space-y-6">
        {article.content.split("\n\n").map((paragraph, index) => {
          if (paragraph.startsWith("### ")) {
            return (
              <h3 key={index} className="text-2xl font-bold text-white mt-8 mb-4 border-l-4 border-red-600 pl-3">
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
      <section className="p-8 rounded-3xl bg-gradient-to-r from-red-950/40 via-black to-zinc-950 border border-red-900/30 text-center space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-white">Never Miss a Cinematic Update!</h3>
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
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 text-white"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 font-semibold px-6 py-3 rounded-xl text-sm transition duration-300 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Comment Section (Engagement) */}
      <section className="space-y-6 pt-10 border-t border-zinc-900">
        <h3 className="text-2xl font-bold text-white">Discussion & Reaction ({comments.length})</h3>

        {/* Comment Form */}
        <form onSubmit={submitComment} className="space-y-4 p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900">
          <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Leave a Comment</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>
          <textarea
            placeholder="Write your reaction to this cinema news..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="bg-zinc-800 hover:bg-red-600 hover:text-white border border-zinc-700 hover:border-red-500 text-zinc-300 font-semibold px-6 py-2.5 rounded-xl text-sm transition duration-300"
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
                className="p-5 rounded-2xl bg-zinc-950/20 border border-zinc-900/50 space-y-2 hover:border-zinc-850 transition duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-red-500 text-sm">{comment.author}</div>
                  <div className="text-xs text-zinc-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}
