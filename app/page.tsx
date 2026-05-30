'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrendingSection from "./components/TrendingSection";
import MovieFeed from "./components/MovieFeed";
import HomeReviewsSection from "./components/HomeReviewsSection";
import Footer from "./components/Footer";
import ScrollTopButton from "./components/ScrollTopButton";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // States for discover & moods
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // States for CineBattle
  const [battleVote, setBattleVote] = useState<string | null>(null);
  const [battleComments, setBattleComments] = useState<{name: string; comment: string; time: string}[]>([
    { name: "Cinephile99", comment: "Interstellar's docking scene is peak cinema. Zimmer's score there is unmatched!", time: "2h ago" },
    { name: "NolanFan", comment: "Inception's hallway fight is practical effects gold. Both are masterpieces, but Inception takes it for structural ingenuity.", time: "4h ago" },
  ]);
  const [newComment, setNewComment] = useState('');

  // States for Daily Challenge
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  const moods = [
    { label: '🤯 Mind-blowing', value: 'mind-blowing' },
    { label: '🍿 Hidden Gem', value: 'hidden-gem' },
    { label: '😱 Thriller', value: 'thriller' },
    { label: '❤️ Romance', value: 'romance' },
    { label: '✨ Anime', value: 'anime' },
    { label: '🇰🇷 K-Dramas', value: 'k-dramas' },
    { label: '⚔️ Action', value: 'action' },
  ];

  // Fetch movies by mood
  useEffect(() => {
    if (!selectedMood) {
      setMovies([]);
      return;
    }
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/discover?mood=${selectedMood}`);
        const data = await res.json();
        setMovies(data.results ? data.results.slice(0, 8) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedMood]);

  // Handle local storage persistence
  useEffect(() => {
    const savedVote = localStorage.getItem('chitra_battle_vote');
    if (savedVote) setBattleVote(savedVote);

    const savedComments = localStorage.getItem('chitra_battle_comments');
    if (savedComments) {
      try {
        setBattleComments(JSON.parse(savedComments));
      } catch (e) {
        console.error(e);
      }
    }

    const savedChallenge = localStorage.getItem('chitra_challenge_answer');
    if (savedChallenge) {
      setSelectedAnswer(savedChallenge);
      setChallengeSubmitted(true);
    }
  }, []);

  const handleBattleVote = (option: string) => {
    setBattleVote(option);
    localStorage.setItem('chitra_battle_vote', option);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj = {
      name: "You",
      comment: newComment.trim(),
      time: "Just now"
    };
    const updated = [commentObj, ...battleComments];
    setBattleComments(updated);
    localStorage.setItem('chitra_battle_comments', JSON.stringify(updated));
    setNewComment('');
  };

  const handleChallengeSubmit = (answer: string) => {
    if (challengeSubmitted) return;
    setSelectedAnswer(answer);
    setChallengeSubmitted(true);
    localStorage.setItem('chitra_challenge_answer', answer);
  };

  const resetChallenge = () => {
    setSelectedAnswer(null);
    setChallengeSubmitted(false);
    localStorage.removeItem('chitra_challenge_answer');
  };

  // Challenge trivia constants
  const challengeQuestion = {
    quote: "Why do we fall, Bruce? So that we can learn to pick ourselves up.",
    correct: "Batman Begins",
    options: ["Batman Begins", "The Dark Knight", "The Dark Knight Rises", "Interstellar"],
    funFact: "This line, spoken by Thomas Wayne and later echoed by Alfred Pennyworth, forms the core thematic spine of Christopher Nolan's Dark Knight trilogy."
  };

  return (
    <main className="bg-[#111111] text-white min-h-screen relative pb-12 selection:bg-red-500 selection:text-white">
      
      {/* Global Navigation Header */}
      <Navbar />

      {/* Landing Hero Area */}
      <HeroSection />

      {/* Main Page Contents Wrapper */}
      <div className="bg-[#111111] relative z-20">
        
        {/* 1. Mood/Vibe Recommendation Finder */}
        <section className="max-w-7xl mx-auto px-6 py-12 border-b border-zinc-900/50">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <span className="text-red-500 text-xs uppercase tracking-widest font-bold block">
              ⚡ Vibe Recommendation Engine
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              What are you in the mood for?
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Skip the endless scrolling. Pick a mood below to surface hand-picked global cinema.
            </p>
          </div>

          {/* Mood Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 max-w-5xl mx-auto mb-10">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`px-4 py-3.5 rounded-2xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                  selectedMood === mood.value
                    ? "bg-red-500 border-red-500 text-white scale-95 shadow-lg shadow-red-500/20"
                    : "bg-[#1A1A1A] border-zinc-800/30 hover:border-zinc-700 text-zinc-300 hover:-translate-y-0.5"
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>

          {/* Results Grid Container */}
          {selectedMood && (
            <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 animate-slide-in-top">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-850 pb-4">
                <h3 className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                  <span>Vibe Match:</span>
                  <span className="text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-xs font-extrabold border border-red-500/20">
                    {moods.find((m) => m.value === selectedMood)?.label || selectedMood}
                  </span>
                </h3>
                <button
                  onClick={() => setSelectedMood(null)}
                  className="text-xs text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-xl transition duration-200 cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-[#111111] rounded-2xl overflow-hidden aspect-[2/3] border border-zinc-900" />
                  ))}
                </div>
              ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      className="group flex flex-col bg-[#111111]/80 rounded-2xl overflow-hidden border border-zinc-900/50 hover:border-red-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/5"
                    >
                      <div className="relative aspect-[2/3] bg-[#111111] overflow-hidden">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4 bg-[#111111] text-zinc-500 text-xs text-center font-bold">
                            {movie.title}
                          </div>
                        )}
                        {movie.vote_average > 0 && (
                          <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-zinc-850 text-red-500 text-[10px] font-black px-1.5 py-0.5 rounded">
                            ★ {movie.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <h4 className="font-bold text-xs text-white group-hover:text-red-500 transition-colors line-clamp-1">
                          {movie.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-1 font-semibold">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-zinc-655 border border-dashed border-zinc-850 rounded-2xl">
                  No vibe matches found. Try another mood!
                </div>
              )}
            </div>
          )}
        </section>

        {/* 2. Trending Movies Carousel Section */}
        <TrendingSection />

        {/* 3. Interactive Community Hub (CineBattle & Daily Trivia Challenge) */}
        <section className="max-w-7xl mx-auto px-6 py-16 border-b border-zinc-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CineBattle Panel */}
            <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest block mb-1">
                    CineBattle Arena
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                    Christopher Nolan Showdown: Inception vs Interstellar
                  </h3>
                </div>

                {/* Matchup Grid */}
                <div className="grid grid-cols-2 gap-4 relative">
                  {/* VS Badge */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#111111] border border-zinc-800 flex items-center justify-center text-[10px] font-black text-red-500 z-10 shadow-lg">
                    VS
                  </div>

                  {/* Inception Option */}
                  <div className={`bg-[#111111]/80 border rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 ${
                    battleVote === 'inception' ? 'border-red-500 bg-red-500/5' : 'border-zinc-800/60 hover:border-zinc-700'
                  }`}>
                    <div className="space-y-2">
                      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A]">
                        <img 
                          src="https://image.tmdb.org/t/p/w500/o0O4Qq75R7tAFOcjMmTTv5A40a.jpg" 
                          alt="Inception" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-xs text-white text-center">Inception</h4>
                    </div>
                    
                    {battleVote ? (
                      <div className="mt-3 text-center">
                        <div className="text-base font-black text-white">46%</div>
                        <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">412 Votes</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBattleVote('inception')}
                        className="w-full mt-3 bg-[#1A1A1A] hover:bg-red-500 hover:text-white border border-zinc-800 hover:border-red-500 text-white py-1.5 rounded-xl text-[10px] font-bold transition duration-250 cursor-pointer"
                      >
                        Vote
                      </button>
                    )}
                  </div>

                  {/* Interstellar Option */}
                  <div className={`bg-[#111111]/80 border rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 ${
                    battleVote === 'interstellar' ? 'border-red-500 bg-red-500/5' : 'border-zinc-800/60 hover:border-zinc-700'
                  }`}>
                    <div className="space-y-2">
                      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A]">
                        <img 
                          src="https://image.tmdb.org/t/p/w500/gEU2QvIPwc30s5vHG9t7gaYYJmc.jpg" 
                          alt="Interstellar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-xs text-white text-center">Interstellar</h4>
                    </div>
                    
                    {battleVote ? (
                      <div className="mt-3 text-center">
                        <div className="text-base font-black text-red-500">54%</div>
                        <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">489 Votes</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBattleVote('interstellar')}
                        className="w-full mt-3 bg-[#1A1A1A] hover:bg-red-500 hover:text-white border border-zinc-800 hover:border-red-500 text-white py-1.5 rounded-xl text-[10px] font-bold transition duration-250 cursor-pointer"
                      >
                        Vote
                      </button>
                    )}
                  </div>
                </div>

                {/* Percentage Progress Bar */}
                {battleVote && (
                  <div className="space-y-2 animate-fade-in bg-[#111111]/60 p-4 border border-zinc-850 rounded-2xl">
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                      <span>Inception (46%)</span>
                      <span>Interstellar (54%)</span>
                    </div>
                    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden flex border border-zinc-850">
                      <div className="h-full bg-zinc-700" style={{ width: '46%' }} />
                      <div className="h-full bg-red-500" style={{ width: '54%' }} />
                    </div>
                  </div>
                )}

                {/* Comments/Debate Thread */}
                <div className="space-y-4 border-t border-zinc-850 pt-4">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Debate Feed</h4>
                  
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add your take..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-[#111111] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/40"
                    />
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Post
                    </button>
                  </form>

                  <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                    {battleComments.map((c, i) => (
                      <div key={i} className="bg-[#111111]/40 border border-zinc-900 rounded-xl p-3 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className="text-red-500">{c.name}</span>
                          <span className="text-zinc-650">{c.time}</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{c.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Quote Trivia Panel */}
            <div className="bg-[#1A1A1A] border border-zinc-800/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest block mb-1">
                    Daily Trivia
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                    Test Your Cinema IQ: Quote Master
                  </h3>
                </div>

                {/* Dialogue Bubble */}
                <div className="bg-[#111111] border border-zinc-850 rounded-2xl p-6 relative overflow-hidden text-center shadow-inner">
                  <span className="absolute top-2 left-3 text-zinc-850 text-6xl font-serif select-none pointer-events-none">“</span>
                  <p className="text-sm md:text-base font-semibold text-white relative z-10 italic leading-relaxed">
                    {challengeQuestion.quote}
                  </p>
                  <span className="absolute bottom-1 right-3 text-zinc-850 text-6xl font-serif select-none pointer-events-none">”</span>
                </div>

                {/* Trivia Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {challengeQuestion.options.map((opt) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrect = opt === challengeQuestion.correct;
                    
                    let btnStyle = "bg-[#111111]/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 cursor-pointer";
                    if (challengeSubmitted) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 cursor-default";
                      } else if (isSelected) {
                        btnStyle = "bg-red-500/10 border-red-500 text-red-500 cursor-default";
                      } else {
                        btnStyle = "bg-[#111111]/25 border-zinc-900/60 text-zinc-600 cursor-default";
                      }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleChallengeSubmit(opt)}
                        disabled={challengeSubmitted}
                        className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-300 ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Trivia Explanation */}
                {challengeSubmitted && (
                  <div className="bg-[#111111]/60 border border-zinc-850 rounded-2xl p-4.5 space-y-3 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-xs">
                        {selectedAnswer === challengeQuestion.correct ? (
                          <span className="text-emerald-400 font-black">✓ Correct! +100 CinePoints</span>
                        ) : (
                          <span className="text-red-500 font-black">✗ Incorrect</span>
                        )}
                      </h4>
                      <button
                        onClick={resetChallenge}
                        className="text-[9px] text-zinc-500 hover:text-white underline font-semibold transition"
                      >
                        Reset Quiz
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
                      {challengeQuestion.funFact}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 4. Movie & OTT Feed Section */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6">
            <span className="text-red-500 text-xs uppercase tracking-widest font-bold block mb-1">
              ⚡ Cinema Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Latest Industry Updates
            </h2>
          </div>
          <MovieFeed />
        </section>

        {/* 5. Community Reviews Grid */}
        <HomeReviewsSection />

      </div>

      {/* Global Footer */}
      <Footer />

      {/* Scroll to Top Trigger */}
      <ScrollTopButton />

    </main>
  );
}