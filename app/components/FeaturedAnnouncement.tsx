"use client";

import { useEffect, useState } from "react";

export default function FeaturedAnnouncement() {
  const [announcement, setAnnouncement] = useState("");

  const updateAnnouncement = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chitra_featured_announcement");
      setAnnouncement(stored || "");
    }
  };

  useEffect(() => {
    updateAnnouncement();

    // Listen to updates from the admin page
    window.addEventListener("announcementUpdate", updateAnnouncement);
    return () => {
      window.removeEventListener("announcementUpdate", updateAnnouncement);
    };
  }, []);

  if (!announcement) return null;

  return (
    <div className="mb-6 bg-red-950/20 border border-red-900/30 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.1)]">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
      <div className="text-xs md:text-sm font-semibold text-zinc-300">
        <span className="text-red-500 font-extrabold mr-1 uppercase">Notice:</span> {announcement}
      </div>
    </div>
  );
}
