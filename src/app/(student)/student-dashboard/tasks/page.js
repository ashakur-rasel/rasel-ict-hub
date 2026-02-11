"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
      Briefcase, CheckCircle, Send, Clock,
      ExternalLink, Timer, Lock, Calendar,
      FileText, Trophy, X, BarChart3, ChevronDown, ChevronUp, MessageSquareQuote, ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function StudentTasksPage() {
      const [tasks, setTasks] = useState([]);
      const [loading, setLoading] = useState(true);
      const [scoreboard, setScoreboard] = useState(null);
      const [now, setNow] = useState(null);
      const [expandedAnswers, setExpandedAnswers] = useState({});
      const [currentUser, setCurrentUser] = useState(null);

      useEffect(() => {
            setNow(new Date());
            const ticker = setInterval(() => setNow(new Date()), 1000);
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            setCurrentUser(storedUser);

            if (!storedUser.email) {
                  window.location.href = "/login";
                  return;
            }

            fetchData(storedUser.email);
            return () => clearInterval(ticker);
      }, []);

      const fetchData = async (email) => {
            try {
                  const res = await fetch('/api/assignments');
                  const assignData = await res.json();
                  const subRes = await fetch(`/api/submissions?studentEmail=${email}`);
                  const subData = await subRes.json();

                  if (assignData.success) {
                        const assignments = assignData.assignments || assignData.data || [];
                        const mySubmissions = subData.data || [];

                        const enhancedTasks = assignments.map(task => {
                              const mySub = mySubmissions.find(s =>
                                    (s.assignmentId?._id || s.assignmentId) === task._id
                              );

                              return {
                                    ...task,
                                    status: mySub ? (mySub.status === "Marked" ? "Marked" : "Submitted") : "Pending",
                                    submissionData: mySub || null
                              };
                        });
                        setTasks(enhancedTasks);
                  }
            } catch (error) {
                  console.error("Fetch error:", error);
            } finally {
                  setLoading(false);
            }
      };

      const toggleAnswer = (id) => {
            setExpandedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
      };

      const openScoreboard = async (assignmentId) => {
            const res = await fetch(`/api/submissions?assignmentId=${assignmentId}`);
            const json = await res.json();
            if (json.success) {
                  const sorted = json.data.sort((a, b) => (b.marks || 0) - (a.marks || 0));
                  setScoreboard(sorted);
            }
      };

      const getDeadlineMetrics = (deadlineStr) => {
            if (!now) return { isExpired: false, countdown: "---", date: "...", time: "..." };
            const deadline = new Date(deadlineStr);
            const diff = deadline - now;
            const formattedDate = deadline.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const formattedTime = deadline.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

            if (diff <= 0) return { isExpired: true, countdown: "00:00:00", date: formattedDate, time: formattedTime };
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            return {
                  isExpired: false,
                  countdown: `${d > 0 ? d + 'd ' : ''}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
                  date: formattedDate,
                  time: formattedTime
            };
      };

      if (loading) return <div className="h-screen bg-[#0f172a] flex items-center justify-center font-black animate-pulse text-blue-500 uppercase tracking-widest text-xs">Syncing Task Hub...</div>;

      return (
            <div className="p-4 space-y-6 pb-28 max-w-4xl mx-auto md:p-8">
                  <header className="p-6 md:p-10 bg-gradient-to-br from-indigo-600 to-blue-900 rounded-[2rem] md:rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="flex flex-col gap-4 relative z-10">
                              <Link href="/student-dashboard" className="w-fit flex items-center gap-2 text-yellow-200 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/10">
                                    <ArrowLeft size={14} /> Back Home
                              </Link>
                              <div>
                                    <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                                          <Briefcase size={28} /> Mission Hub
                                    </h2>
                                    <p className="text-blue-100 text-[9px] md:text-[11px] font-black uppercase opacity-70 mt-1">Submit work. Earn marks. Rule the ranking.</p>
                              </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 pointer-events-none">
                              <Briefcase size={200} />
                        </div>
                  </header>

                  <div className="grid gap-6">
                        {tasks.map((task) => {
                              const metrics = getDeadlineMetrics(task.deadline);
                              const isPending = task.status === "Pending";

                              return (
                                    <motion.div
                                          key={task._id}
                                          initial={{ opacity: 0, y: 15 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className={`bg-slate-900 border rounded-[2rem] p-5 md:p-8 relative overflow-hidden transition-all ${metrics.isExpired && isPending ? 'border-red-500/20 opacity-75' : 'border-white/5'}`}
                                    >
                                          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                                <div className="space-y-3">
                                                      <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`text-[8px] md:text-[10px] font-black uppercase px-3 py-1 rounded-full border ${isPending ? (metrics.isExpired ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'text-rose-400 border-rose-500/20 bg-rose-500/5') : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'}`}>
                                                                  {metrics.isExpired && isPending ? "Mission Failed" : task.status}
                                                            </span>
                                                            {task.attachment && (
                                                                  <a href={task.attachment} target="_blank" rel="noopener noreferrer" className="text-[8px] md:text-[10px] font-black uppercase px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                                                                        <FileText size={12} /> Instruction
                                                                  </a>
                                                            )}
                                                      </div>
                                                      <h3 className="text-lg md:text-xl font-black text-white uppercase italic">{task.title}</h3>
                                                </div>

                                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 w-full md:w-auto min-w-[200px]">
                                                      <div className="space-y-2 text-[10px] md:text-[11px]">
                                                            <div className="flex justify-between font-bold text-gray-500 uppercase tracking-widest">
                                                                  <span>Deadline:</span>
                                                                  <span className="text-white">{metrics.date}</span>
                                                            </div>
                                                            <div className="flex justify-between font-bold text-gray-500 uppercase tracking-widest pb-2 border-b border-white/5">
                                                                  <span>Time:</span>
                                                                  <span className="text-white">{metrics.time}</span>
                                                            </div>
                                                            <div className="flex justify-between pt-1">
                                                                  <span className={`font-black uppercase ${metrics.isExpired ? 'text-red-500' : 'text-blue-400'}`}>T-Minus:</span>
                                                                  <span className={`font-black italic ${metrics.isExpired ? 'text-red-500' : 'text-white'}`}>{metrics.countdown}</span>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>

                                          <p className="text-xs md:text-sm text-gray-400 mb-6 leading-relaxed line-clamp-3 md:line-clamp-none">{task.description}</p>

                                          {isPending ? (
                                                <button
                                                      onClick={() => window.location.href = `/student-dashboard/tasks/submit?id=${task._id}`}
                                                      disabled={metrics.isExpired}
                                                      className={`w-full p-4 md:p-5 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${metrics.isExpired ? "bg-slate-800 text-gray-600 cursor-not-allowed" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 active:scale-95"}`}
                                                >
                                                      {metrics.isExpired ? <><Lock size={16} /> Mission Closed</> : <><Send size={16} /> Start Submission</>}
                                                </button>
                                          ) : (
                                                <div className="space-y-4">
                                                      <div className="bg-slate-800/40 p-4 md:p-6 rounded-2xl border border-white/10 flex flex-col gap-5">
                                                            <div className="flex justify-between items-center">
                                                                  <div className="flex items-center gap-3">
                                                                        <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                                                                        <div>
                                                                              <p className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase">Verification</p>
                                                                              <span className="text-[10px] md:text-xs font-black uppercase text-emerald-500 italic">Work Logged</span>
                                                                        </div>
                                                                  </div>
                                                                  <div className="bg-black/40 px-5 py-2 rounded-xl border border-white/10 text-right">
                                                                        <p className="text-[8px] font-black text-blue-400 uppercase">Marks</p>
                                                                        <p className="text-xl md:text-2xl font-black text-white italic">{task.submissionData.marks || "---"}</p>
                                                                  </div>
                                                            </div>

                                                            {task.status === "Marked" && task.submissionData.feedback && (
                                                                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 md:p-5 rounded-xl relative overflow-hidden">
                                                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                                                              <MessageSquareQuote size={40} className="text-emerald-500" />
                                                                        </div>
                                                                        <p className="text-[7px] md:text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                              <MessageSquareQuote size={12} /> Teacher Feedback
                                                                        </p>
                                                                        <p className="text-[11px] md:text-xs text-gray-200 italic leading-relaxed whitespace-pre-wrap relative z-10">
                                                                              "{task.submissionData.feedback}"
                                                                        </p>
                                                                  </div>
                                                            )}

                                                            {task.submissionData.content && (
                                                                  <div className="border-t border-white/5 pt-4">
                                                                        <button
                                                                              onClick={() => toggleAnswer(task._id)}
                                                                              className="flex items-center justify-between w-full text-[9px] md:text-[10px] font-black uppercase text-gray-400 hover:text-white transition-colors"
                                                                        >
                                                                              <span className="flex items-center gap-2"><FileText size={16} /> View Your Answer</span>
                                                                              {expandedAnswers[task._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                        </button>

                                                                        <AnimatePresence>
                                                                              {expandedAnswers[task._id] && (
                                                                                    <motion.div
                                                                                          initial={{ height: 0, opacity: 0 }}
                                                                                          animate={{ height: "auto", opacity: 1 }}
                                                                                          exit={{ height: 0, opacity: 0 }}
                                                                                          className="overflow-hidden"
                                                                                    >
                                                                                          <div className="mt-4 p-5 bg-black/40 rounded-xl border border-white/5 text-xs md:text-sm text-gray-300 whitespace-pre-wrap font-medium leading-relaxed">
                                                                                                {task.submissionData.content}
                                                                                          </div>
                                                                                    </motion.div>
                                                                              )}
                                                                        </AnimatePresence>
                                                                  </div>
                                                            )}

                                                            {task.submissionData.attachment && (
                                                                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                                                        <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase">Attached Uplink:</p>
                                                                        <a href={task.submissionData.attachment} target="_blank" className="text-blue-400 text-[10px] md:text-xs font-bold flex items-center gap-1 hover:underline">
                                                                              Open Drive Link <ExternalLink size={14} />
                                                                        </a>
                                                                  </div>
                                                            )}
                                                      </div>

                                                      <button
                                                            onClick={() => openScoreboard(task._id)}
                                                            className="w-full bg-blue-600/10 text-blue-400 p-4 rounded-xl border border-blue-500/20 text-[10px] md:text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                                                      >
                                                            <Trophy size={16} /> View Rank Scoreboard
                                                      </button>
                                                </div>
                                          )}
                                    </motion.div>
                              );
                        })}
                  </div>

                  <AnimatePresence>
                        {scoreboard && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm p-4 flex items-center justify-center">
                                    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-6 md:p-8 relative">
                                          <button onClick={() => setScoreboard(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
                                          <h2 className="text-xl font-black text-white uppercase italic mb-6 flex items-center gap-3"><BarChart3 className="text-blue-500" /> Mission Rankings</h2>
                                          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                                                {scoreboard.map((entry, index) => (
                                                      <div key={index} className={`flex items-center justify-between p-4 rounded-2xl border ${entry.studentEmail === currentUser?.email ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-white/5 border-white/5'}`}>
                                                            <div className="flex items-center gap-4">
                                                                  <span className={`font-black text-lg ${index < 3 ? 'text-yellow-500' : 'text-gray-500'}`}>#{index + 1}</span>
                                                                  <span className="text-sm font-bold text-white uppercase">{entry.studentName}</span>
                                                            </div>
                                                            <span className="font-black text-blue-400 italic">{entry.marks} XP</span>
                                                      </div>
                                                ))}
                                          </div>
                                    </motion.div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}