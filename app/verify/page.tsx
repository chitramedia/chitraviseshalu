"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address, please wait...");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token was provided in the URL.");
      return;
    }

    async function performVerification() {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "The verification link is invalid or has expired.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
      }
    }

    performVerification();
  }, [token]);

  // Redirect to login automatically on success after countdown
  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, router]);

  return (
    <div className="relative z-10 w-full max-w-md border border-zinc-800/30 bg-[#1A1A1A] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
      {/* Ambient Inner Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[60px] pointer-events-none transition-all duration-1000 ${
        status === "loading" ? "bg-white/5" :
        status === "success" ? "bg-emerald-500/10" : "bg-rose-500/10"
      }`}></div>

      {status === "loading" && (
        <div className="space-y-6 py-6">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-black">Confirming Email</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl animate-bounce">
              ✓
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">Email Verified!</h2>
          <p className="text-zinc-400 text-sm leading-relaxed px-2">
            Your email has been successfully confirmed. You can now access all profile settings, write movie reviews, save watchlists, and generate AI recomendations.
          </p>
          <div className="text-xs text-zinc-550 font-bold bg-[#111111]/60 py-2.5 px-4 rounded-xl inline-block border border-zinc-800/40">
            Redirecting to login in <span className="text-white font-black">{countdown}</span> seconds...
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block w-full bg-white hover:bg-zinc-200 text-[#111111] font-bold py-4 rounded-full transition duration-300 shadow-md text-sm"
            >
              Log In Now
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl font-black">
              ✕
            </div>
          </div>
          <h2 className="text-2xl font-black text-white">Verification Failed</h2>
          <p className="text-rose-400/90 text-sm leading-relaxed bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl">
            {message}
          </p>
          <p className="text-zinc-500 text-xs px-4">
            If your token has expired, please create a new account to receive a new verification link.
          </p>
          <div className="pt-4 space-y-3">
            <Link
              href="/login"
              className="inline-block w-full bg-white hover:bg-zinc-200 text-[#111111] font-bold py-4 rounded-full transition duration-300 shadow-md text-sm"
            >
              Sign Up / Sign In
            </Link>
            <Link
              href="/"
              className="inline-block w-full border border-white/20 hover:border-white hover:bg-white/10 text-white font-bold py-4 rounded-full transition duration-300 text-sm"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6 relative overflow-hidden pt-20">
        {/* Background Glow */}
        <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>

        <Suspense fallback={
          <div className="relative z-10 w-full max-w-md border border-zinc-800/30 bg-[#1A1A1A] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-black">Loading...</h2>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
