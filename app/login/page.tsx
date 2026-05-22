"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
    }
  }

  async function handleSignup() {

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email.");
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
            className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition"
          >
            Login
          </button>

          <button
            onClick={handleSignup}
            className="border border-zinc-700 hover:border-zinc-500 py-3 rounded-xl transition"
          >
            Create Account
          </button>

        </div>

      </div>

    </main>
  );
}