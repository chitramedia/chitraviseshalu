"use client";

import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-800 shadow-[0_0_25px_rgba(0,0,0,0.45)]">

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:scale-105 transition duration-300"
        >

          <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"></div>

          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide whitespace-nowrap">
            <span className="text-white">Chitra</span>{" "}
            <span className="text-red-600">Viseshalu</span>
          </h1>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3 text-sm font-medium text-zinc-400">

          <Link
            href="/"
            className="hover:text-white hover:bg-zinc-900 px-4 py-2 rounded-xl transition duration-300"
          >
            Home
          </Link>

          <Link
            href="/reviews"
            className="hover:text-white hover:bg-zinc-900 px-4 py-2 rounded-xl transition duration-300"
          >
            Reviews
          </Link>

          <Link
            href="#"
            className="hover:text-white hover:bg-zinc-900 px-4 py-2 rounded-xl transition duration-300"
          >
            OTT
          </Link>

          <Link
            href="#"
            className="hover:text-white hover:bg-zinc-900 px-4 py-2 rounded-xl transition duration-300"
          >
            Trending
          </Link>

          <Link
            href="/watchlist"
            className="hover:text-white hover:bg-zinc-900 px-4 py-2 rounded-xl transition duration-300"
          >
            Watchlist
          </Link>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Mobile Search */}
          <Link
            href="/search"
            className="md:hidden bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-red-500 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white transition duration-300"
          >
            Search
          </Link>

          {/* Desktop Search */}
          <Link
            href="/search"
            className="hidden md:flex bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-red-500 hover:bg-zinc-900 px-4 py-2 rounded-xl text-sm text-zinc-300 hover:text-white transition duration-300"
          >
            Search
          </Link>

          {/* Auth */}
          <AuthButtons />

        </div>

      </nav>

    </header>
  );
}