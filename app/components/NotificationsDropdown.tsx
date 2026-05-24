"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link: string;
  icon: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-pushpa",
    title: "Trailer Record Alert!",
    body: "Pushpa 2: The Rule trailer set a historic record with 100M+ views! Read details.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: false,
    link: "/news/pushpa-2-trailer-release",
    icon: "🔥",
  },
  {
    id: "notif-recs",
    title: "AI Recommendations Ready",
    body: "Explore updated personalized recommendations matching your watchlist genres.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    read: false,
    link: "/recommendations",
    icon: "✨",
  },
  {
    id: "notif-welcome",
    title: "Welcome to Chitra Viseshalu",
    body: "Start reviewing and tracking movies to customize your cinematic feeds.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    link: "/profile",
    icon: "🍿",
  },
];

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load notifications from local storage
    const stored = localStorage.getItem("chitra_notifications");
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    } else {
      setNotifications(DEFAULT_NOTIFICATIONS);
      localStorage.setItem("chitra_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
    }

    // Close on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleToggle = () => setIsOpen(!isOpen);

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("chitra_notifications", JSON.stringify(updated));
  };

  const handleNotificationClick = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem("chitra_notifications", JSON.stringify(updated));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative bg-zinc-900 border border-zinc-800 hover:border-red-500 p-2.5 rounded-xl transition duration-300 text-zinc-300 hover:text-white"
        aria-label="Toggle notifications"
      >
        <span className="text-base md:text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-650 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-zinc-950 border border-zinc-900 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 backdrop-blur-xl">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
            <h3 className="font-extrabold text-sm text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] text-red-500 font-bold hover:text-red-400 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="mt-3 space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-zinc-500 text-xs italic text-center py-6">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => handleNotificationClick(item.id)}
                  className={`flex gap-3 p-3 rounded-2xl border transition duration-350 ${
                    item.read
                      ? "bg-zinc-950/20 border-zinc-950 hover:bg-zinc-900/30"
                      : "bg-red-950/10 border-red-900/20 hover:bg-red-950/20"
                  }`}
                >
                  <span className="text-2xl flex-shrink-0 self-start mt-0.5">{item.icon}</span>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className={`text-xs font-bold truncate ${item.read ? "text-zinc-300" : "text-white"}`}>
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed break-words">{item.body}</p>
                    <span className="text-[9px] text-zinc-500 block pt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
