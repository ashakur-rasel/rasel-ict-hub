"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function StudyHub() {
      const [chapters, setChapters] = useState([]);
      const [selectedChapter, setSelectedChapter] = useState(null);
      const [loading, setLoading] = useState(true);
      const [completedTopics, setCompletedTopics] = useState([]);

      useEffect(() => {
            // 1. Fetch Lessons
            fetch('/api/lessons').then(res => res.json()).then(data => {
                  if (data.success) setChapters(data.lessons || []); //
                  setLoading(false);
            });

            // 2. Load Completed Status from localStorage
            const completed = JSON.parse(localStorage.getItem("completedTopics") || "[]");
            setCompletedTopics(completed);
      }, []);

      if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-blue-500">SYNCING SYLLABUS...</div>;

      return (
            <div className="p-4 space-y-6">
                  <header className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] shadow-xl">
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">Study Hub</h2>
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Track your learning journey</p>
                  </header>

                  <div className="space-y-4">
                        {chapters.map((ch) => (
                              <div key={ch._id} className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden">
                                    <button
                                          onClick={() => setSelectedChapter(selectedChapter === ch.chapter ? null : ch.chapter)}
                                          className="w-full p-6 flex items-center justify-between"
                                    >
                                          <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 text-blue-500 rounded-2xl flex items-center justify-center font-black text-lg">
                                                      {ch.chapter}
                                                </div>
                                                <div className="text-left">
                                                      <h3 className="font-bold text-white text-sm">{ch.chapterTitle}</h3>
                                                      <p className="text-[10px] text-gray-500 font-black uppercase mt-1">
                                                            {ch.topics?.filter(t => completedTopics.includes(t._id)).length || 0} / {ch.topics?.length || 0} COMPLETED
                                                      </p>
                                                </div>
                                          </div>
                                          <ChevronRight className={`transition-transform duration-300 ${selectedChapter === ch.chapter ? 'rotate-90 text-blue-500' : 'text-slate-600'}`} />
                                    </button>

                                    <AnimatePresence>
                                          {selectedChapter === ch.chapter && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-6 pb-6 space-y-2">
                                                      {ch.topics.map((topic) => {
                                                            const isDone = completedTopics.includes(topic._id);
                                                            return (
                                                                  <Link
                                                                        key={topic._id}
                                                                        href={`/student-dashboard/lessons/view?chapter=${ch.chapter}&topic=${topic._id}`}
                                                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDone
                                                                              ? "bg-emerald-500/10 border-emerald-500/30"
                                                                              : "bg-white/5 border-white/5 hover:border-blue-500/50"
                                                                              }`}
                                                                  >
                                                                        <div className="flex items-center gap-3">
                                                                              <div className={`p-2 rounded-lg ${isDone ? 'bg-emerald-500/20' : 'bg-blue-500/10'}`}>
                                                                                    <FileText size={14} className={isDone ? 'text-emerald-400' : 'text-blue-400'} />
                                                                              </div>
                                                                              <span className={`text-xs font-bold ${isDone ? 'text-emerald-400' : 'text-gray-300'}`}>
                                                                                    {topic.topicName}
                                                                              </span>
                                                                        </div>
                                                                        {isDone ? (
                                                                              <CheckCircle size={18} className="text-emerald-500" />
                                                                        ) : (
                                                                              <ChevronRight size={16} className="text-slate-600" />
                                                                        )}
                                                                  </Link>
                                                            );
                                                      })}
                                                </motion.div>
                                          )}
                                    </AnimatePresence>
                              </div>
                        ))}
                  </div>
            </div>
      );
}