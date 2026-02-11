"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, ZoomIn, ZoomOut, RotateCcw, X, CheckCircle } from "lucide-react";
import confetti from 'canvas-confetti';

function TopicContent() {
      const searchParams = useSearchParams();
      const router = useRouter();
      const chapterId = searchParams.get("chapter");
      const topicId = searchParams.get("topic");

      const [topic, setTopic] = useState(null);
      const [loading, setLoading] = useState(true);
      const [isFinished, setIsFinished] = useState(false);
      const [zoomImage, setZoomImage] = useState(null);

      const getDirectLink = (url) => {
            if (!url) return "";
            const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
            if (match && match[1]) {
                  return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
            }
            return url;
      };

      useEffect(() => {
            // 1. Fetch Lesson Data
            fetch(`/api/lessons?chapter=${chapterId}`)
                  .then(res => res.json())
                  .then(data => {
                        if (data.success) {
                              const foundTopic = data.lessons.topics.find(t => t._id === topicId);
                              setTopic(foundTopic);
                        }
                        setLoading(false);
                  });

            // 2. Check if already finished in localStorage
            const completed = JSON.parse(localStorage.getItem("completedTopics") || "[]");
            if (completed.includes(topicId)) {
                  setIsFinished(true);
            }
      }, [chapterId, topicId]);

      const handleComplete = () => {
            setIsFinished(true);

            // Save to localStorage so Lessons Page can see it
            const completed = JSON.parse(localStorage.getItem("completedTopics") || "[]");
            if (!completed.includes(topicId)) {
                  completed.push(topicId);
                  localStorage.setItem("completedTopics", JSON.stringify(completed));
            }

            confetti({
                  particleCount: 150,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#10b981', '#3b82f6']
            });
      };

      if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-blue-600">LOADING MODULE...</div>;

      return (
            <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
                  <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex justify-between items-center">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                              <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-sm font-black uppercase tracking-widest text-blue-600 truncate max-w-[200px]">
                              {topic?.topicName}
                        </h1>
                        <div className="w-10" />
                  </header>

                  <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                              <div
                                    className="prose prose-slate max-w-none theory-content"
                                    dangerouslySetInnerHTML={{ __html: topic?.content }} //
                              />

                              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {topic?.images?.map((img, i) => (
                                          <div key={i} className="relative group overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 aspect-video">
                                                <img
                                                      src={getDirectLink(img)}
                                                      alt="Visual Resource"
                                                      className="w-full h-full object-contain p-2"
                                                />
                                                <button onClick={() => setZoomImage(getDirectLink(img))} className="absolute inset-0 bg-blue-600/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <ZoomIn className="text-blue-600" size={32} />
                                                </button>
                                          </div>
                                    ))}
                              </div>
                        </motion.div>

                        <button
                              onClick={handleComplete}
                              disabled={isFinished}
                              className={`w-full p-6 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isFinished
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                    : "bg-blue-600 text-white shadow-xl shadow-blue-500/30 active:scale-95"
                                    }`}
                        >
                              {isFinished ? (
                                    <><CheckCircle /> Module Completed!</>
                              ) : (
                                    <><Sparkles /> Mark Section as Finished</>
                              )}
                        </button>
                  </main>
            </div>
      );
}

export default function StudyPortalView() {
      return (
            <Suspense fallback={<div>Loading...</div>}>
                  <TopicContent />
            </Suspense>
      );
}