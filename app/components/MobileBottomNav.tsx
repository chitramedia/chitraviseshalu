"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileBottomNav() {

  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (pathname === "/") return null;

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: "🏠",
    },
    {
      name: "Reviews",
      href: "/reviews",
      icon: "⭐",
    },
    {
      name: "AI Recs",
      href: "/recommendations",
      icon: "✨",
    },
    {
      name: "Search",
      href: "/search",
      icon: "🔍",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: "👤",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-zinc-800">

      <div className="grid grid-cols-5">

        {navItems.map((item) => (

          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-3 text-xs transition duration-300 ${
              pathname === item.href
                ? "text-red-500"
                : "text-zinc-500"
            }`}
          >

            <span className="text-xl mb-1">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </Link>

        ))}

      </div>

    </div>
  );
}