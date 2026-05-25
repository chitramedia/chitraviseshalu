"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log the error to a console or reporting service
    console.error("Unhandled runtime error captured by boundary:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6 py-24">
      <div className="text-center space-y-8 max-w-md bg-[#1A1A1A] border border-zinc-800/30 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Cinematic Glitch Icon */}
        <div className="w-20 h-20 bg-[#111111] rounded-full flex items-center justify-center mx-auto border border-zinc-800/60 shadow-lg relative group">
          <span className="text-4xl select-none group-hover:scale-110 transition duration-300">⚠️</span>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            A Cinematic Glitch Occurred
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The projector has encountered a temporary error while loading this page. Don't worry, the film hasn't burned.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full bg-white hover:bg-zinc-200 text-[#111111] font-bold py-3.5 rounded-full transition duration-300 shadow-md text-sm cursor-pointer"
          >
            Retry Projection
          </button>
          <Link
            href="/"
            className="w-full border border-white/20 hover:border-white hover:bg-white/10 text-white font-bold py-3.5 rounded-full transition duration-300 text-sm"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
