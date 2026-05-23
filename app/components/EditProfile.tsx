"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function EditProfile() {

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data?.display_name) {
      setDisplayName(data.display_name);
    }
  };

  const saveProfile = async () => {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: displayName,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile updated!");
  };

  return (
    <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/40 backdrop-blur-md mb-14">

      <h2 className="text-2xl font-bold mb-6">
        Edit Profile
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 outline-none focus:border-red-500 transition"
        />

        <button
          onClick={saveProfile}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition duration-300"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </div>

    </div>
  );
}