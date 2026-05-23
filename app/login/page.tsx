"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleSignup() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      alert("Account created! Please verify your email.");
      router.push("/");
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
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
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Welcome Back
        </h1>

        {/* Email */}
        <div className="mb-5">

          <label className="block text-sm text-zinc-400 mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-600"
          />

        </div>

        {/* Password */}
        <div className="mb-8">

          <label className="block text-sm text-zinc-400 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-red-600"
          />

        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="border border-zinc-700 hover:border-zinc-500 disabled:opacity-50 py-3 rounded-xl transition"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="px-4 text-xs text-zinc-500 uppercase">or</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.7 0 3.2.58 4.4 1.7l3.3-3.3C17.7 1.57 15 1 12 1 7.37 1 3.4 3.73 1.58 7.72l3.9 3.03C6.4 7.6 9 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.73-4.94 3.73-8.58z"
              />
              <path
                fill="#FBBC05"
                d="M5.48 10.75c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.58 3.14C.58 5.12 0 7.37 0 9.75s.58 4.63 1.58 6.61l3.9-3.03z"
              />
              <path
                fill="#34A853"
                d="M12 18.96c-3 0-5.6-2.56-6.52-5.71l-3.9 3.03c1.82 3.99 5.79 6.72 10.42 6.72 3.1 0 5.72-1.02 7.63-2.77l-3.7-2.87c-1.06.71-2.42 1.1-3.93 1.1z"
              />
            </svg>
            Continue with Google
          </button>

        </div>

      </div>

    </main>
  );
}