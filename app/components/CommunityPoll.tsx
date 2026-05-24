"use client";

import { useEffect, useState } from "react";

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

const DEFAULT_POLL_OPTIONS: PollOption[] = [
  { id: "opt-pushpa", label: "Pushpa 2: The Rule (Sukumar / Allu Arjun)", votes: 342 },
  { id: "opt-coolie", label: "Coolie (Lokesh Kanagaraj / Rajinikanth)", votes: 215 },
  { id: "opt-gamechanger", label: "Game Changer (Shankar / Ram Charan)", votes: 189 },
  { id: "opt-ssmb29", label: "SSMB29 (S.S. Rajamouli / Mahesh Babu)", votes: 489 },
];

export default function CommunityPoll() {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState("");

  useEffect(() => {
    // Load poll details
    const storedOptions = localStorage.getItem("chitra_poll_options");
    const storedVote = localStorage.getItem("chitra_poll_has_voted");

    if (storedOptions) {
      try {
        setOptions(JSON.parse(storedOptions));
      } catch {
        setOptions(DEFAULT_POLL_OPTIONS);
      }
    } else {
      setOptions(DEFAULT_POLL_OPTIONS);
      localStorage.setItem("chitra_poll_options", JSON.stringify(DEFAULT_POLL_OPTIONS));
    }

    if (storedVote) {
      setHasVoted(true);
      setVotedOptionId(storedVote);
    }
  }, []);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    const updatedOptions = options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    setOptions(updatedOptions);
    setHasVoted(true);
    setVotedOptionId(optionId);

    localStorage.setItem("chitra_poll_options", JSON.stringify(updatedOptions));
    localStorage.setItem("chitra_poll_has_voted", optionId);
  };

  const totalVotes = options.reduce((acc, opt) => acc + opt.votes, 0);

  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden shadow-xl">
      {/* Ambient background accent */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-650/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 space-y-5">
        <div>
          <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest block mb-1">
            Chitra Poll of the Week
          </span>
          <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
            Which upcoming Indian blockbuster are you most excited to watch?
          </h3>
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            const isSelected = votedOptionId === opt.id;

            return (
              <button
                key={opt.id}
                disabled={hasVoted}
                onClick={() => handleVote(opt.id)}
                className={`w-full text-left relative overflow-hidden rounded-2xl border transition duration-300 ${
                  hasVoted ? "cursor-default" : "hover:border-red-500/50"
                } ${
                  isSelected
                    ? "bg-red-600/10 border-red-500/60 text-white"
                    : "bg-zinc-900/40 border-zinc-900 text-zinc-300"
                }`}
              >
                {/* Vote fill bar */}
                {hasVoted && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ${
                      isSelected ? "bg-red-600/10" : "bg-zinc-800/30"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                )}

                <div className="relative z-10 px-5 py-4 flex justify-between items-center gap-4 text-xs sm:text-sm font-semibold">
                  <span>{opt.label}</span>
                  {hasVoted && (
                    <span className="text-xs font-bold text-zinc-400">
                      {percentage}% ({opt.votes})
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-2 border-t border-zinc-900">
          <span>Total community votes: {totalVotes}</span>
          {hasVoted && <span className="text-red-500 font-bold">✓ Thank you for voting!</span>}
        </div>
      </div>
    </div>
  );
}
