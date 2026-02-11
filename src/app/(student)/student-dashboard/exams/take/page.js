"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Send, ShieldCheck, Lock, AlertTriangle } from "lucide-react";
import confetti from 'canvas-confetti';

function ExamSession() {
      const searchParams = useSearchParams();
      const router = useRouter();
      const examId = searchParams.get("id");

      const [exam, setExam] = useState(null);
      const [userAnswers, setUserAnswers] = useState({});
      const [timeLeft, setTimeLeft] = useState(0);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [lockInfo, setLockInfo] = useState(null);
      const [currentUser, setCurrentUser] = useState(null); // Added for dynamic identity

      useEffect(() => {
            // FIX: Get the unique user data from memory instead of hardcoded ID
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            setCurrentUser(storedUser);

            if (!examId) return;
            fetch(`/api/exams?id=${examId}`)
                  .then(res => res.json())
                  .then(json => {
                        if (json.isLocked) {
                              setLockInfo({ startTime: json.startTime });
                              return;
                        }

                        if (json.success) {
                              setExam(json.exam);
                              setTimeLeft(json.exam.duration * 60);
                        } else {
                              router.replace('/student-dashboard/exams');
                        }
                  });
      }, [examId, router]);

      useEffect(() => {
            if (timeLeft > 0) {
                  const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
                  return () => clearInterval(timer);
            } else if (timeLeft === 0 && exam && !isSubmitting) {
                  handleSubmit();
            }
      }, [timeLeft, exam, isSubmitting]);

      const handleOptionSelect = (qId, optionKey) => {
            setUserAnswers(prev => ({ ...prev, [qId]: optionKey }));
      };

      const handleSubmit = async () => {
            if (isSubmitting || !currentUser) return;
            setIsSubmitting(true);

            const formattedAnswers = Object.entries(userAnswers).map(([qId, opt]) => ({
                  questionId: qId,
                  selectedOption: opt
            }));

            const resultPayload = {
                  examId: exam._id,
                  // FIX: Using dynamic identity from the logged-in student
                  studentId: currentUser._id,
                  studentName: currentUser.name,
                  answers: formattedAnswers
            };

            try {
                  const res = await fetch('/api/results', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(resultPayload)
                  });
                  const json = await res.json();
                  if (json.success) {
                        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                        router.push(`/student-dashboard/exams/result?id=${json.data._id}`);
                  }
            } catch (e) {
                  setIsSubmitting(false);
            }
      };

      if (lockInfo) return (
            <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-slate-900 border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-6">
                        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-500">
                              <Lock size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Arena Locked</h2>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto">
                              This exam is scheduled for a future time. Please return at <span className="text-blue-500 font-bold">{lockInfo.startTime}</span>.
                        </p>
                        <button
                              onClick={() => router.replace('/student-dashboard/exams')}
                              className="w-full bg-blue-600 p-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                        >
                              Back to Exams
                        </button>
                  </motion.div>
            </div>
      );

      if (!exam) return (
            <div className="h-screen bg-[#0f172a] flex items-center justify-center font-black text-blue-500 animate-pulse">
                  SYNCING EXAM ENGINE...
            </div>
      );

      return (
            <div className="min-h-screen bg-[#0f172a] text-white p-4">
                  <div className={`sticky top-4 z-[100] flex justify-between items-center p-5 rounded-[2rem] border backdrop-blur-xl mb-10 ${timeLeft < 30 ? 'bg-red-600 border-white' : 'bg-slate-900/90 border-white/10 shadow-2xl'}`}>
                        <div className="flex items-center gap-3">
                              <Clock className={timeLeft < 30 ? "animate-spin" : ""} />
                              <span className="text-xl font-black italic">
                                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                              </span>
                        </div>
                        <div className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase">
                              {Object.keys(userAnswers).length} / {exam.questions.length} Answered
                        </div>
                  </div>

                  <div className="space-y-16 max-w-2xl mx-auto">
                        {exam.questions.map((q, idx) => (
                              <div key={q._id} className="space-y-6">
                                    <div className="flex gap-4">
                                          <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black shrink-0 shadow-lg shadow-blue-600/20">{idx + 1}</span>
                                          <div className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 w-full">
                                                <h4 className="font-bold text-lg">{q.questionText}</h4>
                                          </div>
                                    </div>

                                    <div className="grid gap-3 pl-14">
                                          {Object.entries(q.options).map(([key, text]) => (
                                                <button
                                                      key={key}
                                                      onClick={() => handleOptionSelect(q._id, key)}
                                                      className={`p-5 rounded-2xl text-left font-bold border-2 transition-all ${userAnswers[q._id] === key
                                                            ? "bg-blue-600 border-white shadow-xl scale-[1.02]"
                                                            : "bg-slate-900 border-white/5 text-gray-400"
                                                            }`}
                                                >
                                                      <span className="uppercase mr-3 opacity-50">{key}.</span> {text}
                                                </button>
                                          ))}
                                    </div>
                              </div>
                        ))}

                        <div className="mt-20 p-10 bg-slate-900 border-2 border-dashed border-white/10 rounded-[3rem] text-center space-y-6">
                              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                                    <ShieldCheck size={32} />
                              </div>
                              <div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Review & Finish</h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Make sure you have answered all {exam.questions.length} questions before submitting.</p>
                              </div>

                              <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 p-6 rounded-[2rem] font-black italic uppercase tracking-widest shadow-2xl shadow-emerald-600/40 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                              >
                                    {isSubmitting ? "SYNCING RESULTS..." : <><Send size={20} /> SUBMIT EXAM NOW</>}
                              </button>
                        </div>
                  </div>

                  <div className="h-20"></div>
            </div>
      );
}

export default function ExamPage() {
      return <Suspense fallback={<div className="h-screen bg-[#0f172a] text-blue-500 flex items-center justify-center font-black animate-pulse uppercase tracking-[0.3em]">INITIALISING ARENA...</div>}><ExamSession /></Suspense>
}