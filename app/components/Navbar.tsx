"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthButtons from "./AuthButtons";
import NotificationsDropdown from "./NotificationsDropdown";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Run once on mount in case page is already scrolled
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#111111]/90 backdrop-blur-md border-b border-zinc-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          : "bg-gradient-to-b from-[#111111]/80 to-transparent"
      }`}
    >

      <nav
        className={`max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
          scrolled ? "py-3.5" : "py-5"
        }`}
      >

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:scale-105 transition duration-300"
        >

          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>

          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide whitespace-nowrap text-white">
            Chitra Viseshalu
          </h1>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-white">

          <Link
            href="/"
            className="hover:text-zinc-300 transition duration-300"
          >
            Home
          </Link>

          <Link
            href="/reviews"
            className="hover:text-zinc-300 transition duration-300"
          >
            Reviews
          </Link>

          <Link
            href="/recommendations"
            className="hover:text-zinc-300 transition duration-300"
          >
            AI Recs
          </Link>

          <Link
            href="/news"
            className="hover:text-zinc-300 transition duration-300"
          >
            News
          </Link>

          <Link
            href="/watchlist"
            className="hover:text-zinc-300 transition duration-300"
          >
            Watchlist
          </Link>

          <Link
            href="#poll"
            className="hover:text-zinc-300 transition duration-300"
          >
            Polls
          </Link>

          <Link
            href="/admin"
            className="text-white/40 hover:text-white transition duration-300"
          >
            Admin
          </Link>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Mobile Search */}
          <Link
            href="/search"
            className="md:hidden text-white hover:text-zinc-300 text-xs font-semibold transition duration-300"
          >
            Search
          </Link>

          {/* Desktop Search */}
          <Link
            href="/search"
            className="hidden md:flex text-white hover:text-zinc-300 text-sm font-semibold transition duration-300"
          >
            Search
          </Link>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Auth */}
          <AuthButtons />

        </div>

      </nav>

    </header>
  );
}