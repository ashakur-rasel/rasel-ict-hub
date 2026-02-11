"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2, XCircle, Home, RotateCcw, Medal, Users, AlertCircle } from "lucide-react";

function ResultView() {
      const searchParams = useSearchParams();
      const router = useRouter();
      const resultId = searchParams.get("id");

      const [result, setResult] = useState(null);
      const [leaderboard, setLeaderboard] = useState([]);
      const [loading, setLoading] = useState(true);
      const [view, setView] = useState("personal");

      useEffect(() => {
            if (!resultId) return;
            fetch(`/api/results?id=${resultId}`)
                  .then(res => res.json())
                  .then(json => {
                        if (json.success) {
                              setResult(json.data);
                              fetch(`/api/results?examId=${json.data.examId._id}`)
                                    .then(res => res.json())
                                    .then(lData => { if (lData.success) setLeaderboard(lData.results); });
                        }
                        setLoading(false);
                  });
      }, [resultId]);

      if (loading) return <div className="h-screen bg-[#0f172a] flex items-center justify-center font-black animate-pulse text-blue-500">GENERATING SCORECARD...</div>;
      if (!result) return <div className="h-screen bg-[#0f172a] text-white flex items-center justify-center font-black">RESULT NOT FOUND</div>;

      return (
            <div className="min-h-screen bg-[#0f172a] text-white p-4 pb-24">
                  {/* Switcher Header */}
                  <div className="flex bg-slate-900 p-2 rounded-[2.5rem] border border-white/5 mb-8 mt-6 shadow-2xl">
                        <button onClick={() => setView("personal")} className={`flex-1 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${view === 'personal' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>
                              <Medal size={14} /> Review Answers
                        </button>
                        <button onClick={() => setView("global")} className={`flex-1 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${view === 'global' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500'}`}>
                              <Users size={14} /> Global Rank
                        </button>
                  </div>

                  <AnimatePresence mode="wait">
                        {view === "personal" ? (
                              <motion.div key="p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

                                    {/* Score Hero Section */}
                                    <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 rounded-[3rem] border border-white/10 text-center shadow-2xl relative overflow-hidden">
                                          <Trophy className="mx-auto text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" size={56} />
                                          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-6">{result.examId.title}</h2>
                                          <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-black/30 p-5 rounded-[2rem] border border-white/5">
                                                      <p className="text-[9px] font-black text-blue-400 uppercase mb-1 tracking-widest">Final Score</p>
                                                      <p className="text-4xl font-black">{result.score}<span className="text-sm opacity-30">/{result.examId.totalMarks}</span></p>
                                                </div>
                                                <div className="bg-black/30 p-5 rounded-[2rem] border border-white/5">
                                                      <p className="text-[9px] font-black text-blue-400 uppercase mb-1 tracking-widest">Accuracy</p>
                                                      <p className="text-4xl font-black">{((result.score / result.examId.totalMarks) * 100).toFixed(0)}%</p>
                                                </div>
                                          </div>
                                    </div>

                                    {/* Answer Breakdown with Question Text */}
                                    <div className="space-y-12">
                                          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 px-2 flex items-center gap-3">
                                                <CheckCircle2 size={16} className="text-emerald-500" /> Correction Guide
                                          </h3>

                                          {result.answers.map((ans, idx) => {
                                                const isCorrect = ans.selectedOption === ans.correctAnswer;
                                                // Find original question to get all options
                                                const originalQuestion = result.examId.questions.find(q => q._id === ans.questionId);

                                                return (
                                                      <div key={idx} className="space-y-5">
                                                            <div className="flex gap-4 items-start">
                                                                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shrink-0 shadow-lg ${isCorrect ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                                                        {idx + 1}
                                                                  </span>
                                                                  <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5 w-full">
                                                                        <h4 className="font-bold text-sm md:text-base leading-relaxed">{ans.questionText}</h4>
                                                                  </div>
                                                            </div>

                                                            <div className="grid gap-3 pl-14">
                                                                  {Object.entries(originalQuestion?.options || {}).map(([key, text]) => {
                                                                        const isThisCorrect = key === ans.correctAnswer;
                                                                        const isThisStudentChoice = key === ans.selectedOption;

                                                                        let variantClasses = "bg-slate-900 border-white/5 text-gray-500";
                                                                        if (isThisCorrect) variantClasses = "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]";
                                                                        if (isThisStudentChoice && !isThisCorrect) variantClasses = "bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]";

                                                                        return (
                                                                              <div key={key} className={`p-5 rounded-2xl border-2 font-bold flex items-center gap-4 transition-all ${variantClasses}`}>
                                                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${isThisCorrect || (isThisStudentChoice && !isThisCorrect) ? 'bg-white/20' : 'bg-white/5'}`}>
                                                                                          {key.toUpperCase()}
                                                                                    </div>
                                                                                    <span className="text-sm">{text}</span>
                                                                                    {isThisCorrect && <CheckCircle2 size={18} className="ml-auto text-white" />}
                                                                                    {isThisStudentChoice && !isThisCorrect && <XCircle size={18} className="ml-auto text-white" />}
                                                                              </div>
                                                                        );
                                                                  })}
                                                            </div>
                                                      </div>
                                                );
                                          })}
                                    </div>
                              </motion.div>
                        ) : (
                              <motion.div key="g" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                    {/* Leaderboard UI - already implemented correctly */}
                                    {leaderboard.map((entry, index) => (
                                          <div key={entry._id} className={`p-5 rounded-[2rem] border-2 flex justify-between items-center ${entry.studentId === result.studentId ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-slate-900 border-white/5'}`}>
                                                <div className="flex items-center gap-4">
                                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-white/10'}`}>
                                                            {index + 1}
                                                      </div>
                                                      <p className="font-black uppercase text-sm">{entry.studentName}</p>
                                                </div>
                                                <div className="text-right">
                                                      <p className="text-xl font-black text-blue-400">{entry.score}</p>
                                                      <p className="text-[8px] font-black text-gray-500 uppercase">Points</p>
                                                </div>
                                          </div>
                                    ))}
                              </motion.div>
                        )}
                  </AnimatePresence>

                  {/* Navigation Footer */}
                  <div className="mt-16 grid grid-cols-2 gap-4">
                        <button onClick={() => router.push('/student-dashboard')} className="bg-slate-900 p-6 rounded-[2.5rem] font-black uppercase text-[10px] border border-white/10 flex flex-col items-center gap-2 tracking-widest active:scale-95 transition-all">
                              <Home size={20} /> Back Home
                        </button>
                        <button onClick={() => router.push('/student-dashboard/exams')} className="bg-blue-600 p-6 rounded-[2.5rem] font-black uppercase text-[10px] shadow-xl shadow-blue-600/30 flex flex-col items-center gap-2 tracking-widest active:scale-95 transition-all">
                              <RotateCcw size={20} /> Exam Arena
                        </button>
                  </div>
            </div>
      );
}

export default function ResultPage() {
      return <Suspense><ResultView /></Suspense>
}