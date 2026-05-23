"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const signIn = async () => {

    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
    });

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
          {/* Avatar */}
        <div className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-white text-black text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.18)]">
            {user.email?.charAt(0).toUpperCase()}

          </div>

          {/* Logout */}
          <button
            onClick={signOut}
            disabled={loading}
            className="bg-zinc-900 border border-zinc-800 hover:border-red-500 disabled:opacity-50 px-5 py-2 rounded-xl text-sm font-semibold transition duration-300"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </>

      ) : (

        <button
          onClick={signIn}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-2 rounded-xl text-sm font-semibold transition duration-300"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

      )}

    </div>
  );
}