'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export default function GlobalCinemaHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // States for discover & moods
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // States for search in Discover tab
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  // States for trending movies in Discover tab
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

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

  // Fetch trending movies on discover tab active
  useEffect(() => {
    if (activeTab === 'discover') {
      const fetchTrending = async () => {
        setLoadingTrending(true);
        try {
          const res = await fetch('/api/discover?mood=trending');
          const data = await res.json();
          setTrendingMovies(data.results ? data.results.slice(0, 8) : []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingTrending(false);
        }
      };
      fetchTrending();
    }
  }, [activeTab]);

  // Fetch search results inline
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.results ? data.results.slice(0, 4) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle local storage persistence
  useEffect(() => {
    // Read query parameter to set active tab on mount
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['home', 'discover', 'battles', 'challenge'].includes(tab)) {
      setActiveTab(tab);
    }

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
    <div className="min-h-screen bg-black text-neutral-100 font-sans pb-32 selection:bg-amber-500 selection:text-black">
      
      {/* 1. TOP CENTER BRANDING */}
      <header className="w-full py-6 flex flex-col items-center justify-center border-b border-neutral-900 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-2xl font-black tracking-widest text-amber-500 text-center">
          CHITRA VISHESHALU
        </h1>
        <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mt-1">
          DISCOVER • PLAY • DEBATE
        </p>
      </header>

      {/* MAIN CONTENT DISPLAY ROUTER */}
      <main className="max-w-4xl mx-auto pt-16 px-8 sm:px-12 md:px-16 pb-12">
        
        {activeTab === 'home' && (
          <div className="space-y-20 animate-slide-in-top">
            {/* Mood Search Prompt */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                What are you in the mood for?
              </h2>
              <p className="text-neutral-400 text-sm max-w-md mx-auto mb-8">
                No endless scrolling. Pick a vibe to surface instant global recommendations.
              </p>
            </div>

            {/* Quick Mood Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`px-4 py-3.5 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    selectedMood === mood.value
                      ? 'bg-amber-500 border-amber-500 text-black scale-95 shadow-lg shadow-amber-500/20'
                      : 'bg-neutral-950 border-neutral-900 hover:border-neutral-800 text-neutral-300 hover:-translate-y-0.5'
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>

            {/* Dynamic Display Area */}
            <div className="max-w-4xl mx-auto">
              {selectedMood ? (
                <section className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 text-left shadow-2xl">
                  <div className="flex justify-between items-center mb-6 border-b border-neutral-900 pb-4">
                    <h3 className="text-sm font-bold text-neutral-400 flex items-center gap-2">
                      <span>Vibe Match:</span>
                      <span className="text-amber-400 capitalize font-black bg-amber-500/10 px-3 py-1 rounded-full text-xs border border-amber-550/20">
                        {moods.find(m => m.value === selectedMood)?.label || selectedMood}
                      </span>
                    </h3>
                    <button 
                      onClick={() => setSelectedMood(null)} 
                      className="text-xs text-neutral-500 hover:text-white border border-neutral-900 hover:border-neutral-700 px-3 py-1.5 rounded-lg transition duration-200 cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-neutral-900 rounded-xl overflow-hidden aspect-[2/3] border border-neutral-900" />
                      ))}
                    </div>
                  ) : movies.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {movies.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movie/${movie.id}`}
                          className="group flex flex-col bg-neutral-900/30 rounded-xl overflow-hidden border border-neutral-900/50 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5"
                        >
                          <div className="relative aspect-[2/3] bg-neutral-950 overflow-hidden">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center p-4 bg-neutral-900 text-neutral-500 text-xs text-center font-bold">
                                {movie.title}
                              </div>
                            )}
                            {movie.vote_average > 0 && (
                              <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-neutral-800 text-amber-400 text-[10px] font-black px-1.5 py-0.5 rounded">
                                ★ {movie.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <h4 className="font-bold text-xs text-neutral-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                              {movie.title}
                            </h4>
                            <p className="text-[10px] text-neutral-500 mt-1 font-semibold">
                              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-xs text-neutral-600 border border-dashed border-neutral-900 rounded-xl">
                      No movies found for this vibe right now.
                    </div>
                  )}
                </section>
              ) : (
                /* Interactive Features Preview Block */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 text-left flex flex-col justify-between h-40 hover:border-amber-550/20 transition-all duration-300 group shadow-lg">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white text-base group-hover:text-amber-500 transition-colors">⚔️ CineBattle</h3>
                        <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">VOTE NOW</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">Interstellar vs Inception. Cast your vote and see where the community stands.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('battles')}
                      className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors duration-200 self-start flex items-center gap-1 cursor-pointer"
                    >
                      Vote Now <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                  
                  <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 text-left flex flex-col justify-between h-40 hover:border-amber-550/20 transition-all duration-300 group shadow-lg">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white text-base group-hover:text-amber-500 transition-colors">🧩 Daily Challenge</h3>
                        <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">PLAY</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">Guess the movie title from a single quote. Build your CinePoints streak.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('challenge')}
                      className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors duration-200 self-start flex items-center gap-1 cursor-pointer"
                    >
                      Play <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="space-y-10 text-center animate-slide-in-top">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                Discover Global Cinema
              </h2>
              <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">
                Search directly or pick a vibe below to explore highly rated hidden gems and blockbusters.
              </p>
            </div>

            {/* Elegant Search Input */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search movies, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 bg-neutral-950 border border-neutral-900 rounded-2xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition duration-300"
              />
              <span className="absolute right-4 top-3.5 text-neutral-500 text-sm">🔍</span>
            </div>

            {/* Search Results Display */}
            {searchQuery.trim().length >= 2 && (
              <div className="max-w-2xl mx-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-5 text-left shadow-2xl space-y-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  {searching ? 'Searching...' : `Search Results (${searchResults.length})`}
                </h3>
                {searching ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center gap-3">
                        <div className="w-10 h-14 bg-neutral-900 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-neutral-900 rounded w-1/3" />
                          <div className="h-2 bg-neutral-900 rounded w-1/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-neutral-900">
                    {searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="flex items-center gap-4 py-3 group first:pt-0 last:pb-0"
                      >
                        <div className="w-10 h-14 bg-neutral-900 rounded overflow-hidden flex-shrink-0">
                          {movie.poster_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-neutral-100 group-hover:text-amber-400 transition-colors">
                            {movie.title}
                          </h4>
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} • ★ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-600 py-4 text-center">No movies found matching "{searchQuery}"</p>
                )}
              </div>
            )}

            {/* Mood selector grid inside Discover */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest text-left max-w-2xl mx-auto">
                Select a Vibe
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => {
                      setSelectedMood(mood.value);
                      setActiveTab('home');
                    }}
                    className="px-4 py-3 rounded-xl border border-neutral-900 bg-neutral-950 text-neutral-300 text-xs font-semibold hover:border-neutral-800 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending This Week Row */}
            <div className="space-y-4 text-left max-w-4xl mx-auto">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-2">
                Trending This Week
              </h3>
              {loadingTrending ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-neutral-900 rounded-xl overflow-hidden aspect-[2/3] border border-neutral-900" />
                  ))}
                </div>
              ) : trendingMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {trendingMovies.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      className="group flex flex-col bg-neutral-900/30 rounded-xl overflow-hidden border border-neutral-900/50 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5"
                    >
                      <div className="relative aspect-[2/3] bg-neutral-950 overflow-hidden">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4 bg-neutral-900 text-neutral-500 text-xs text-center font-bold">
                            {movie.title}
                          </div>
                        )}
                        {movie.vote_average > 0 && (
                          <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-neutral-800 text-amber-400 text-[10px] font-black px-1.5 py-0.5 rounded">
                            ★ {movie.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-xs text-neutral-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                          {movie.title}
                        </h4>
                        <p className="text-[10px] text-neutral-500 mt-1 font-semibold">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-600 py-4 px-2">Offline mock records fetched.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'battles' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-slide-in-top">
            <div className="text-center">
              <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                CineBattle Arena
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mt-3 mb-2">
                Nolan Face-off
              </h2>
              <p className="text-neutral-400 text-sm max-w-md mx-auto">
                Debate, vote, and crown the ultimate science fiction epic.
              </p>
            </div>

            {/* The Matchup Card Grid */}
            <div className="grid grid-cols-2 gap-4 relative">
              {/* VS Divider badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center text-xs font-black text-amber-400 z-10 shadow-xl shadow-black">
                VS
              </div>

              {/* Inception Option */}
              <div 
                className={`bg-neutral-950 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  battleVote === 'inception' 
                    ? 'border-amber-500 shadow-xl shadow-amber-500/5' 
                    : 'border-neutral-900 hover:border-neutral-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900">
                    <img 
                      src="https://image.tmdb.org/t/p/w500/o0O4Qq75R7tAFOcjMmTTv5A40a.jpg" 
                      alt="Inception" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">Inception</h3>
                    <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">2010 • Christopher Nolan</p>
                  </div>
                </div>
                
                {battleVote ? (
                  <div className="mt-4 pt-3 border-t border-neutral-900 text-center">
                    <div className="text-lg font-black text-white">46%</div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">412 Votes</div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBattleVote('inception')}
                    className="w-full mt-4 bg-neutral-900 hover:bg-amber-500 hover:text-black border border-neutral-850 hover:border-amber-550 text-white py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                  >
                    Vote Inception
                  </button>
                )}
                {battleVote === 'inception' && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    My Vote ✓
                  </div>
                )}
              </div>

              {/* Interstellar Option */}
              <div 
                className={`bg-neutral-950 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  battleVote === 'interstellar' 
                    ? 'border-amber-500 shadow-xl shadow-amber-500/5' 
                    : 'border-neutral-900 hover:border-neutral-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden bg-neutral-900">
                    <img 
                      src="https://image.tmdb.org/t/p/w500/gEU2QvIPwc30s5vHG9t7gaYYJmc.jpg" 
                      alt="Interstellar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">Interstellar</h3>
                    <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">2014 • Christopher Nolan</p>
                  </div>
                </div>
                
                {battleVote ? (
                  <div className="mt-4 pt-3 border-t border-neutral-900 text-center">
                    <div className="text-lg font-black text-amber-400">54%</div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">489 Votes</div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleBattleVote('interstellar')}
                    className="w-full mt-4 bg-neutral-900 hover:bg-amber-500 hover:text-black border border-neutral-850 hover:border-amber-550 text-white py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                  >
                    Vote Interstellar
                  </button>
                )}
                {battleVote === 'interstellar' && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                    My Vote ✓
                  </div>
                )}
              </div>
            </div>

            {/* Voting Meter breakdown */}
            {battleVote && (
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-3 animate-fade-in shadow-xl">
                <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
                  <span>Inception (46%)</span>
                  <span>Interstellar (54%)</span>
                </div>
                <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden flex">
                  <div className="h-full bg-neutral-700" style={{ width: '46%' }} />
                  <div className="h-full bg-amber-500" style={{ width: '54%' }} />
                </div>
                <p className="text-[10px] text-center text-neutral-500 font-semibold">
                  Total community votes cast: 901. Thank you for voting!
                </p>
              </div>
            )}

            {/* Discussion & Comments Area */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 space-y-6">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-3">
                Arena Debate
              </h3>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share your reasoning..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-850 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/40"
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-black text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-amber-400 transition cursor-pointer"
                >
                  Post
                </button>
              </form>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {battleComments.map((c, i) => (
                  <div key={i} className="bg-neutral-900/50 border border-neutral-900/60 rounded-xl p-3.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-amber-500">{c.name}</span>
                      <span className="text-[9px] text-neutral-600 font-bold">{c.time}</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                      {c.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'challenge' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-slide-in-top">
            <div className="text-center">
              <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                Daily Trivia
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mt-3 mb-2">
                Quote Master
              </h2>
              <p className="text-neutral-400 text-sm max-w-sm mx-auto">
                Guess the movie title based on the dialogue. Reset every 24h.
              </p>
            </div>

            {/* Blockquote Quote */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-2 left-4 text-neutral-800 text-7xl font-serif select-none pointer-events-none">“</div>
              <p className="text-lg md:text-xl font-semibold text-white relative z-10 italic leading-relaxed">
                {challengeQuestion.quote}
              </p>
              <div className="absolute bottom-2 right-4 text-neutral-800 text-7xl font-serif select-none pointer-events-none">”</div>
            </div>

            {/* Options Button Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              {challengeQuestion.options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === challengeQuestion.correct;
                
                let btnStyle = "bg-neutral-950 border-neutral-900 text-neutral-300 hover:border-neutral-800 cursor-pointer";
                if (challengeSubmitted) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 cursor-default";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-500/10 border-rose-500 text-rose-400 cursor-default";
                  } else {
                    btnStyle = "bg-neutral-950/40 border-neutral-950/60 text-neutral-600 cursor-default";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleChallengeSubmit(opt)}
                    disabled={challengeSubmitted}
                    className={`px-5 py-4 rounded-xl border text-xs font-bold transition-all duration-300 ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Results Details Card */}
            {challengeSubmitted && (
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 max-w-xl mx-auto text-left space-y-4 animate-fade-in shadow-xl">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-sm flex items-center gap-2">
                    {selectedAnswer === challengeQuestion.correct ? (
                      <span className="text-emerald-400 font-black">✓ Correct! +100 CinePoints</span>
                    ) : (
                      <span className="text-rose-400 font-black">✗ Incorrect</span>
                    )}
                  </h4>
                  <button
                    onClick={resetChallenge}
                    className="text-[10px] text-neutral-500 hover:text-white underline font-semibold transition"
                  >
                    Reset & Try Again
                  </button>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                  {challengeQuestion.funFact}
                </p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* 2. MODERN FIXED BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-6 inset-x-0 mx-auto max-w-md px-4 z-50">
        <nav className="bg-neutral-900/90 backdrop-blur-lg border border-neutral-850 rounded-2xl px-3 py-2 flex justify-between items-center shadow-2xl shadow-black">
          {['Home', 'Discover', 'Battles', 'Challenge', 'Watchlist'].map((tab) => {
            const isTabActive = tab === 'Watchlist' ? false : activeTab === tab.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'Watchlist') {
                    router.push('/watchlist');
                  } else {
                    setActiveTab(tab.toLowerCase());
                    if (tab === 'Home') setSelectedMood(null); // Reset filters on home click
                  }
                }}
                className={`px-3 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 cursor-pointer ${
                  isTabActive
                    ? 'bg-amber-500 text-black scale-105 shadow-md shadow-amber-500/10'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
}