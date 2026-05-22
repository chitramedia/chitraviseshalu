"use client";
import Link from "next/link";
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-zinc-800">

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">

          <div className="w-3 h-3 rounded-full bg-red-600"></div>

          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide whitespace-nowrap">
            <span className="text-white">Chitra</span>{" "}
            <span className="text-red-600">Viseshalu</span>
          </h1>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">

          <Link
            href="/"
            className="hover:text-white transition duration-200"
          >
            Home
          </Link>

          <Link
            href="/search"
            className="hover:text-white transition duration-200"
          >
            Search
          </Link>

          <Link
            href="#"
            className="hover:text-white transition duration-200"
          >
            Reviews
          </Link>

          <Link
            href="#"
            className="hover:text-white transition duration-200"
          >
            OTT
          </Link>

          <Link
            href="#"
            className="hover:text-white transition duration-200"
          >
            Trending
          </Link>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Mobile Search */}
          <Link
            href="/search"
            className="md:hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white transition"
          >
            Search
          </Link>

          {/* Desktop Search */}
          <Link
            href="/search"
            className="hidden md:flex bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition"
          >
            Search Movies
          </Link>

          {/* Auth Buttons */}
          <AuthButtons />

        </div>

      </nav>

    </header>
  );
}