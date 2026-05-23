"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {

  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-8 bg-zinc-900 border border-zinc-800 hover:border-red-500 px-5 py-3 rounded-xl transition duration-300"
    >
      ← Back
    </button>
  );
}