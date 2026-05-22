"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthButtons() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    async function getUser() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    getUser();

  }, []);

  async function handleLogout() {

    await supabase.auth.signOut();

    window.location.reload();
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">
          {user.email?.charAt(0).toUpperCase()}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-zinc-900 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-xl text-sm"
        >
          Logout
        </button>

      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="bg-red-600 hover:bg-red-700 px-4 md:px-5 py-2 rounded-xl text-sm font-semibold transition"
    >
      Login
    </Link>
  );
}