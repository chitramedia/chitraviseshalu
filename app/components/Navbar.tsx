"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";
import NotificationsDropdown from "./NotificationsDropdown";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent transition duration-300">

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-5">

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