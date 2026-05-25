"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Email Login
  async function handleLogin() {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  // Email Signup
  async function handleSignup() {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully!");

    router.push("/");
    router.refresh();
  }

  // Google Login
  async function handleGoogleLogin() {

    setLoading(true);

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/`,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md border border-zinc-800/30 bg-[#1A1A1A] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">

          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>

          <h1 className="text-2xl font-extrabold tracking-wide text-white">
            Chitra Viseshalu
          </h1>

        </div>

        {/* Heading */}
        <div className="text-center mb-8">

          <h2 className="text-3xl font-extrabold mb-2">
            Welcome Back
          </h2>

          <p className="text-zinc-400 text-sm leading-relaxed">
            Login to continue your cinematic journey.
          </p>

        </div>

        {/* Email */}
        <div className="mb-5">

          <label className="block text-xs font-semibold text-zinc-400 mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#111111]/80 border border-zinc-800/80 rounded-2xl px-5 py-4 outline-none focus:border-white transition duration-300 text-sm"
          />

        </div>

        {/* Password */}
        <div className="mb-8">

          <label className="block text-xs font-semibold text-zinc-400 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#111111]/80 border border-zinc-800/80 rounded-2xl px-5 py-4 outline-none focus:border-white transition duration-300 text-sm"
          />

        </div>

        {/* Buttons */}
        <div className="space-y-4">

          {/* Login */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-[#111111] disabled:opacity-50 py-4 rounded-full font-bold transition duration-300 text-sm"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          {/* Signup */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full border border-white/20 hover:border-white hover:bg-white/10 text-white py-4 rounded-full font-bold transition duration-300 text-sm"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center py-2">

            <div className="flex-grow border-t border-zinc-800/40"></div>

            <span className="px-4 text-[10px] uppercase text-zinc-500 font-bold">
              or
            </span>

            <div className="flex-grow border-t border-zinc-800/40"></div>

          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-white/20 hover:border-white hover:bg-white/10 text-white disabled:opacity-50 py-4 rounded-full font-bold transition duration-300 flex items-center justify-center gap-3 text-sm"
          >

            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />

            Continue with Google

          </button>

        </div>

      </div>

    </main>
  );
}