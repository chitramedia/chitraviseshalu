"use client";

import { useEffect, useState } from "react";
import { supabase, getSessionUser } from "../lib/supabase";
import Link from "next/link";

export default function AuthButtons() {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      subscription.unsubscribe();
    };

  }, []);

  const checkUser = async () => {
    const user = await getSessionUser();
    setUser(user);
  };

  const signIn = async () => {

    setLoading(true);

    window.location.href = "/login";

    setLoading(false);
  };

  const signOut = async () => {

    setLoading(true);

    await supabase.auth.signOut();

    setUser(null);

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">

      {user ? (

        <>
          {/* Clickable Avatar pointing to Profile */}
          <Link
            href="/profile"
            title="View Profile"
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white text-black text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.18)] hover:scale-105 hover:bg-zinc-200 transition duration-300"
          >
            {user.email?.charAt(0).toUpperCase()}
          </Link>

          {/* Logout */}
          <button
            onClick={signOut}
            disabled={loading}
            className="border border-white/20 hover:border-white hover:bg-white/10 text-white disabled:opacity-50 px-5 py-2 rounded-full text-sm font-bold transition duration-300"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </>

      ) : (

        <button
          onClick={signIn}
          disabled={loading}
          className="bg-white hover:bg-zinc-200 text-[#111111] disabled:opacity-50 px-5 py-2 rounded-full text-sm font-bold transition duration-300"
        >
          {loading ? "Opening..." : "Login"}
        </button>

      )}

    </div>
  );
}