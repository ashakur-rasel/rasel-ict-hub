"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, PlayCircle, Timer, CheckCircle, Lock, Calendar } from "lucide-react";
import Link from "next/link";

export default function ExamListPage() {
      const [exams, setExams] = useState([]);
      const [loading, setLoading] = useState(true);
      const [currentTime, setCurrentTime] = useState(new Date());
      const studentId = "698191543aca7a7841264ed7"; // Replace with dynamic context

      useEffect(() => {
            // 1. Refresh the clock every second for the countdowns
            const timer = setInterval(() => setCurrentTime(new Date()), 1000);

            const loadData = async () => {
                  const res = await fetch('/api/exams');
                  const data = await res.json();

                  if (data.success) {
                        const updatedExams = await Promise.all(data.exams.map(async (exam) => {
                              const checkRes = await fetch(`/api/results?studentId=${studentId}&examId=${exam._id}`);
                              const checkJson = await checkRes.json();
                              return { ...exam, isFinished: checkJson.alreadySubmitted, userResultId: checkJson.resultId };
                        }));
                        setExams(updatedExams);
                  }
                  setLoading(false);
            };

            loadData();
            return () => clearInterval(timer);
      }, []);

      // Helper to calculate countdown or status
      const getExamStatus = (exam) => {
            const examDate = new Date(exam.date);
            const [hours, minutes] = exam.startTime.split(':');
            examDate.setHours(parseInt(hours), parseInt(minutes), 0);

            const diff = examDate - currentTime;

            if (exam.isFinished) return { state: "finished" };
            if (diff > 0) {
                  // Calculate hours, minutes, seconds remaining
                  const h = Math.floor(diff / 3600000);
                  const m = Math.floor((diff % 3600000) / 60000);
                  const s = Math.floor((diff % 60000) / 1000);
                  return { state: "upcoming", timeLeft: `${h}h ${m}m ${s}s` };
            }
            return { state: "live" };
      };

      if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-blue-500 uppercase tracking-widest">Initialising Arena...</div>;

      return (
            <div className="p-4 space-y-6">
                  <header className="mb-8 p-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] shadow-xl">
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Exam Arena</h2>
                        <p className="text-blue-100 text-[10px] font-black uppercase opacity-60">One attempt. Maximum glory.</p>
                  </header>

                  <div className="grid gap-4">
                        {exams.map((exam) => {
                              const status = getExamStatus(exam);

                              return (
                                    <div key={exam._id} className={`p-6 rounded-[2.5rem] border-2 transition-all ${status.state === "finished" ? 'bg-emerald-500/5 border-emerald-500/20' :
                                          status.state === "upcoming" ? 'bg-slate-900 border-white/5 opacity-80' :
                                                'bg-blue-600/5 border-blue-500/30 shadow-lg shadow-blue-500/5'
                                          }`}>
                                          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                                <div className="text-center md:text-left">
                                                      <h3 className={`text-lg font-black uppercase italic ${status.state === 'finished' ? 'text-emerald-400' : 'text-white'}`}>{exam.title}</h3>
                                                      <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                                                  <Calendar size={12} /> {new Date(exam.date).toLocaleDateString()}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                                                  <Timer size={12} /> {exam.startTime}
                                                            </span>
                                                      </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                      {status.state === "finished" ? (
                                                            <Link href={`/student-dashboard/exams/result?id=${exam.userResultId}`}>
                                                                  <button className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                                                                        VIEW SCORE <CheckCircle size={16} />
                                                                  </button>
                                                            </Link>
                                                      ) : status.state === "upcoming" ? (
                                                            <div className="flex flex-col items-end">
                                                                  <span className="text-[8px] font-black text-blue-500 uppercase mb-1 tracking-widest">Unlocks In</span>
                                                                  <div className="bg-blue-600/10 text-blue-400 px-6 py-2 rounded-xl border border-blue-500/20 font-black italic text-sm">
                                                                        {status.timeLeft}
                                                                  </div>
                                                            </div>
                                                      ) : (
                                                            <Link href={`/student-dashboard/exams/take?id=${exam._id}`}>
                                                                  <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-blue-600/30 flex items-center gap-2"
                                                                  >
                                                                        START NOW <PlayCircle size={16} />
                                                                  </motion.button>
                                                            </Link>
                                                      )}
                                                </div>
                                          </div>
                                    </div>
                              );
                        })}
                  </div>
            </div>
      );
}