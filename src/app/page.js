"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ParticlesBackground from "@/components/ParticlesBackground";
import { Laptop, GraduationCap, Phone, Mail, Cpu, Gamepad2, Newspaper, ChevronDown, X, Circle, Terminal, RefreshCw, Lightbulb } from "lucide-react";

export default function Home() {
  const [currentSpeech, setCurrentSpeech] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // --- Game 1: Cross-Zero States ---
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState("Impossible");
  const [gameMessage, setGameMessage] = useState("System Ready: Input Data... 🖥️");

  // --- Game 2: Word Shuffle States ---
  const techData = [
    { word: "DATABASE", hint: "A structured set of data held in a computer." },
    { word: "NETWORK", hint: "A group of interconnected computers." },
    { word: "FIREWALL", hint: "A security system that monitors network traffic." },
    { word: "BINARY", hint: "The base-2 numbering system used by computers." },
    { word: "PROTOCOL", hint: "A set of rules for data communication." }
  ];
  const [shuffleWord, setShuffleWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [currentTech, setCurrentTech] = useState(techData[0]);
  const [showHint, setShowHint] = useState(false);
  const [shuffleStatus, setShuffleStatus] = useState("Decode the hash below... 🔑");

  // --- Game 3: Word Match States ---
  const pairs = { "IP": "Address", "HTML": "Markup", "USB": "Storage", "CPU": "Processor" };
  const [selectedKey, setSelectedKey] = useState(null);
  const [matchScore, setMatchScore] = useState(0);
  const [matchMessage, setMatchMessage] = useState("Waiting for handshake... 🔗");

  const speeches = [
    "Programming isn't about what you know; it's about what you can figure out. 💻",
    "RASEL ICT HUB: Building the Digital Leaders of tomorrow. 🚀",
    "Don't just use apps, build them. Start your journey today! ✨",
    "Success is a series of small wins. Keep coding! 🌟"
  ];

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setCurrentSpeech((prev) => (prev + 1) % speeches.length);
    }, 4000);
    initShuffle();
    return () => clearInterval(timer);
  }, []);

  // --- Game 1 Logic (Cross-Zero) ---
  const winner = calculateWinner(board);
  useEffect(() => {
    if (winner) {
      setGameMessage(winner === 'X' ? "Security Breach: Bot Hacked! 🤖💥" : "System Error: Bot Formatted You! 🧠💾");
      const timer = setTimeout(() => { setBoard(Array(9).fill(null)); setIsXNext(true); setGameMessage("System Ready: Input Data... 🖥️"); }, 2500);
      return () => clearTimeout(timer);
    } else if (!board.includes(null)) {
      setGameMessage("Ping Timeout: Draw Match! 🌐");
      const timer = setTimeout(() => { setBoard(Array(9).fill(null)); setIsXNext(true); setGameMessage("System Ready: Input Data... 🖥️"); }, 2500);
      return () => clearTimeout(timer);
    } else if (!isXNext) {
      const timer = setTimeout(() => {
        let move;
        if (difficulty === "Easy") {
          const moves = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
          move = moves[Math.floor(Math.random() * moves.length)];
        } else if (difficulty === "Medium") {
          move = Math.random() > 0.5 ? getBestMove(board) : board.indexOf(null);
        } else {
          move = getBestMove(board);
        }
        handleSquareClick(move);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, board, difficulty]);

  const handleSquareClick = (i) => {
    if (winner || board[i] || i === -1) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // --- Game 2 Logic (Word Shuffle) ---
  const initShuffle = () => {
    const item = techData[Math.floor(Math.random() * techData.length)];
    setCurrentTech(item);
    setShuffleWord(item.word.split('').sort(() => Math.random() - 0.5).join(''));
    setUserInput("");
    setShowHint(false);
  };

  const checkShuffle = () => {
    if (userInput.toUpperCase() === currentTech.word) {
      setShuffleStatus("Access Granted: Code Decrypted! 🔓");
      setTimeout(() => { initShuffle(); setShuffleStatus("Decode the hash below... 🔑"); }, 2000);
    } else {
      setShuffleStatus("Access Denied: Wrong Hash! ❌");
      setTimeout(() => setShuffleStatus("Decode the hash below... 🔑"), 2000);
    }
  };

  // --- Game 3 Logic (Word Match) ---
  const handleMatch = (val, type) => {
    if (type === 'key') {
      setSelectedKey(val);
      setMatchMessage(`Selected ${val}. Finding peer...`);
    } else if (selectedKey && pairs[selectedKey] === val) {
      setMatchScore(prev => prev + 1);
      setMatchMessage("Handshake Successful: Data Linked! 🤝");
      setSelectedKey(null);
      setTimeout(() => setMatchMessage("Waiting for handshake... 🔗"), 2000);
    } else {
      setMatchMessage("Connection Reset: Invalid Peer! 🔌");
      setSelectedKey(null);
      setTimeout(() => setMatchMessage("Waiting for handshake... 🔗"), 2000);
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-[#0f172a]" />;

  return (
    <main className="relative min-h-screen w-full bg-[#0f172a] overflow-x-hidden text-white">
      <ParticlesBackground />

      {/* Floating Animated Icons */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} initial={{ x: -100, y: (i + 1) * 100 }}
            animate={{ x: "110vw", y: [(i + 1) * 100, (i + 1) * 80, (i + 1) * 100] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: i * 5 }}
            className="absolute opacity-10"
          >
            <Cpu size={30 + i * 10} className="text-blue-400" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-[100] bg-slate-900/80 backdrop-blur-lg border-b border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter">
            RASEL <span className="text-blue-500 italic">ICT HUB</span>
          </h1>
          <nav className="hidden lg:flex gap-8 text-gray-300 font-medium">
            <a href="#games" className="hover:text-blue-400 transition">Games</a>
            <a href="#blog" className="hover:text-blue-400 transition">Tech Blog</a>
            <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
          </nav>
          <div className="relative">
            <button onClick={() => setIsLoginOpen(!isLoginOpen)} className="bg-blue-600 px-5 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition text-sm md:text-base">
              Login <ChevronDown size={16} className={isLoginOpen ? "rotate-180 transition" : "transition"} />
            </button>
            <AnimatePresence>
              {isLoginOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-48 bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  {/* Student Login Link */}
                  <Link href="/login?role=student" className="w-full flex items-center gap-3 px-4 py-4 hover:bg-blue-600 transition text-left border-b border-white/5">
                    <GraduationCap size={18} /> Student Login
                  </Link>

                  {/* Teacher Login Link */}
                  <Link href="/login?role=admin" className="w-full flex items-center gap-3 px-4 py-4 hover:bg-blue-600 transition text-left">
                    <Laptop size={18} /> Teacher Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center justify-center min-h-screen text-center z-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full text-blue-400 text-xs md:text-sm font-bold mb-6">
          Welcome to the Future of Learning 🌐
        </motion.div>
        <h2 className="text-4xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
          Master ICT with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 italic font-black">Interactive Fun</span>
        </h2>
        <div className="h-20 mb-12 flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.p key={currentSpeech} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-lg md:text-2xl text-gray-400 italic max-w-3xl leading-snug">
              "{speeches[currentSpeech]}"
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4">
          <Link href="/login?role=student" className="bg-white text-black px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition w-full sm:w-auto">
            <GraduationCap /> Student Portal
          </Link>
          <Link href="/login?role=admin" className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white transition w-full sm:w-auto">
            <Laptop /> Teacher Portal
          </Link>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-24 bg-slate-900/50 relative z-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Gamepad2 size={32} className="text-blue-500" />
            <h3 className="text-3xl md:text-4xl font-black">Gamification Zone</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Cross-Zero Game */}
            <div className="bg-slate-800/50 p-6 md:p-8 rounded-[2rem] border border-white/10 flex flex-col items-center">
              <div className="flex gap-2 mb-6 bg-slate-900/80 p-1.5 rounded-xl border border-white/5 w-full max-w-xs justify-between">
                {["Easy", "Medium", "Impossible"].map(lvl => (
                  <button key={lvl} onClick={() => { setDifficulty(lvl); setBoard(Array(9).fill(null)); }} className={`flex-1 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all ${difficulty === lvl ? 'bg-blue-600 shadow-lg scale-105' : 'text-gray-500 hover:text-gray-300'}`}>{lvl}</button>
                ))}
              </div>
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2 font-mono uppercase tracking-tighter"><Terminal size={18} /> CROSS_ZERO.EXE</h4>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {board.map((square, i) => (
                  <button key={i} onClick={() => handleSquareClick(i)} className="w-20 h-20 md:w-24 md:h-24 bg-slate-700 rounded-2xl text-3xl font-black flex items-center justify-center hover:bg-slate-600 transition shadow-inner">
                    {square === 'X' && <X size={40} className="text-blue-400 drop-shadow-md" />}
                    {square === 'O' && <Circle size={40} className="text-rose-400 drop-shadow-md" />}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-blue-400 font-mono animate-pulse uppercase tracking-tighter h-6 text-center text-sm">{gameMessage}</p>
            </div>

            {/* Side Games */}
            <div className="space-y-6 w-full">
              {/* Word Shuffle */}
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xl font-bold flex items-center gap-2 font-black italic"><RefreshCw size={18} className="text-purple-500" /> Word Shuffle</h5>
                  <button onClick={() => setShowHint(!showHint)} className="text-yellow-500 hover:scale-110 transition p-2 bg-yellow-500/10 rounded-lg"><Lightbulb size={20} /></button>
                </div>
                <div className="flex gap-2 mb-4 font-mono text-2xl md:text-3xl text-purple-400 uppercase tracking-widest bg-slate-950/50 p-6 rounded-xl justify-center font-black">{shuffleWord}</div>
                <AnimatePresence>
                  {showHint && (
                    <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-xs text-yellow-500/80 mb-4 italic p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                      HINT: {currentTech.hint}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="flex gap-2 mb-4">
                  <input value={userInput} onChange={(e) => setUserInput(e.target.value)} className="bg-slate-900 border border-white/10 rounded-lg px-4 py-3 w-full outline-none focus:border-blue-500 font-mono text-sm" placeholder="Input hash..." />
                  <button onClick={checkShuffle} className="bg-blue-600 px-6 py-2 rounded-lg font-black hover:bg-blue-700 transition">VERIFY</button>
                </div>
                <p className={`text-center text-xs font-mono uppercase tracking-widest font-bold ${shuffleStatus.includes('Granted') ? 'text-green-400' : 'text-purple-400'}`}>{shuffleStatus}</p>
              </div>

              {/* Word Match */}
              <div className="bg-slate-800/30 p-6 rounded-2xl border border-white/5">
                <h5 className="text-xl font-bold mb-4 flex items-center gap-2 font-black italic">🔗 Handshake Match</h5>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="flex flex-col gap-2">
                    {Object.keys(pairs).map(k => (
                      <button key={k} onClick={() => handleMatch(k, 'key')} className={`px-3 py-3 text-xs md:text-sm rounded-lg border transition-all font-bold ${selectedKey === k ? 'bg-blue-600 border-white scale-105 shadow-lg' : 'border-white/10 bg-slate-900 hover:bg-slate-800'}`}>{k}</button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    {Object.values(pairs).sort().map(v => (
                      <button key={v} onClick={() => handleMatch(v, 'val')} className="px-3 py-3 text-xs md:text-sm rounded-lg border border-white/10 bg-slate-700 hover:bg-blue-500 transition-all active:scale-95 font-bold">{v}</button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 p-3 bg-slate-950/50 rounded-xl border border-white/5 text-center">
                  <p className={`text-xs font-mono mb-2 font-bold ${matchMessage.includes('Successful') ? 'text-green-400' : 'text-blue-400'}`}>{matchMessage}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Nodes Synchronized: {matchScore}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Blog */}
      <section id="blog" className="py-24 px-4 md:px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Newspaper size={32} className="text-purple-500" />
            <h3 className="text-3xl md:text-4xl font-black">Technology Pulse</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-[2rem] h-64 bg-slate-800 border border-white/10">
              <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-blue-600/40 transition duration-500"></div>
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-blue-600 text-[10px] px-3 py-1 rounded-md uppercase font-black tracking-tighter shadow-lg">New Update</span>
                <h4 className="text-xl md:text-2xl font-black mt-2 text-white">The Future of AI in Education</h4>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-[2rem] h-64 bg-slate-800 border border-white/10">
              <div className="absolute inset-0 bg-purple-600/20 group-hover:bg-purple-600/40 transition duration-500"></div>
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-purple-600 text-[10px] px-3 py-1 rounded-md uppercase font-black tracking-tighter shadow-lg">Cyber Security</span>
                <h4 className="text-xl md:text-2xl font-black mt-2 text-white">Protecting Digital Identity</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 pt-20 pb-10 px-6 relative z-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <h1 className="text-2xl font-black mb-6 tracking-tighter text-white uppercase italic">RASEL <span className="text-blue-500 italic">ICT HUB</span></h1>
            <p className="text-gray-500 italic text-sm leading-relaxed max-w-xs">"The best way to predict the future is to invent it. Join us in shaping the digital landscape."</p>
          </div>
          <div className="flex flex-col gap-4">
            <h5 className="font-black text-white uppercase text-xs tracking-[0.2em]">Contact Info</h5>
            <p className="flex items-center gap-3 text-gray-400 text-sm font-medium"><Phone size={16} className="text-blue-500" /> +880 1837686860</p>
            <p className="flex items-center gap-3 text-gray-400 text-sm font-medium"><Mail size={16} className="text-blue-500" /> rasel.ashakur@gmail.com</p>
          </div>
          <div className="flex flex-col gap-4 text-gray-400 text-sm">
            <h5 className="font-black text-white uppercase text-xs tracking-[0.2em]">Platform</h5>
            <p className="hover:text-blue-500 cursor-pointer transition font-medium">Teacher Login</p>
            <p className="hover:text-blue-500 cursor-pointer transition font-medium">Student Login</p>
          </div>
        </div>
        <div className="text-center text-gray-600 text-[10px] uppercase tracking-[0.3em] border-t border-white/5 pt-8 font-black">
          © 2026 RASEL ICT HUB | All Systems Active
        </div>
      </footer>
    </main>
  );
}

// --- Minimax Logic ---
function getBestMove(board) {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  let result = calculateWinner(board);
  if (result === "O") return 10 - depth;
  if (result === "X") return depth - 10;
  if (!board.includes(null)) return 0;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function calculateWinner(squares) {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}