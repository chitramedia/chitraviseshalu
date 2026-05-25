"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface ProfileMetadata {
  bio?: string;
  avatar?: string;
  favoriteGenres?: string[];
  location?: string;
}

export default function EditProfile() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🍿");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const avatars = ["🍿", "🎬", "🎥", "🎟️", "👑", "🕶️", "🦁", "🔥", "✨"];
  const genres = ["Action", "Comedy", "Drama", "Thriller", "Sci-Fi", "Romance", "Horror", "Mythology", "Fantasy"];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Load display_name from database profiles
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data?.display_name) {
      setDisplayName(data.display_name);
    }

    // Load additional metadata from localStorage as a secure fallback
    const metaStored = localStorage.getItem(`profile_meta_${user.id}`);
    if (metaStored) {
      try {
        const meta = JSON.parse(metaStored) as ProfileMetadata;
        if (meta.bio) setBio(meta.bio);
        if (meta.avatar) setSelectedAvatar(meta.avatar);
        if (meta.favoriteGenres) setSelectedGenres(meta.favoriteGenres);
        if (meta.location) setLocation(meta.location);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const saveProfile = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Try upserting display_name to database profiles
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: displayName,
      });

    // Save extended metadata to localStorage
    const meta: ProfileMetadata = {
      bio,
      avatar: selectedAvatar,
      favoriteGenres: selectedGenres,
      location,
    };
    localStorage.setItem(`profile_meta_${user.id}`, JSON.stringify(meta));

    // Also trigger profile update event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("profileUpdate"));
    }

    setLoading(false);

    if (dbError) {
      alert(`Display name failed to sync with server, but profile options saved locally: ${dbError.message}`);
      return;
    }

    alert("Profile options updated successfully!");
  };

  return (
    <div className="border border-zinc-800/30 rounded-3xl p-6 md:p-8 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-14 space-y-6">
      <h2 className="text-2xl font-black text-white">Upgrade Profile Options</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Enter display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3.5 outline-none focus:border-white text-white text-sm transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="E.g. Hyderabad, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl px-4 py-3.5 outline-none focus:border-white text-white text-sm transition"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Avatar Icon
            </label>
            <div className="flex flex-wrap gap-2.5 p-3.5 bg-[#111111]/85 border border-zinc-800/40 rounded-xl">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition duration-200 hover:scale-110 ${
                    selectedAvatar === av
                      ? "bg-white text-black font-bold border border-white shadow-md"
                      : "bg-[#111111] hover:bg-[#1A1A1A] text-zinc-400 border border-zinc-800/50"
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Bio
            </label>
            <textarea
              placeholder="Write a short cinema bio about yourself. Favorite directors, actors, etc..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full bg-[#111111]/85 border border-zinc-800/60 rounded-xl p-4 outline-none focus:border-white text-white text-sm transition leading-relaxed resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
              Favorite Genres
            </label>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      isSelected
                        ? "bg-white/10 border-white text-white font-bold"
                        : "bg-[#111111]/60 border-zinc-800/50 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800/40 flex justify-end">
        <button
          onClick={saveProfile}
          disabled={loading}
          className="bg-white hover:bg-zinc-200 disabled:opacity-50 text-[#111111] font-bold px-6 py-3.5 rounded-full text-sm transition duration-300 shadow-md"
        >
          {loading ? "Saving Profile..." : "Save Profile Details"}
        </button>
      </div>
    </div>
  );
}