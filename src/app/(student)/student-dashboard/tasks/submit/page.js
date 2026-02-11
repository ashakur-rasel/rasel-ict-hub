"use client";
import { useState, useEffect, Suspense } from "react"; // Added useEffect
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, Link as LinkIcon, FileText, ArrowLeft } from "lucide-react";
import confetti from 'canvas-confetti';

function SubmitForm() {
      const searchParams = useSearchParams();
      const router = useRouter();
      const taskId = searchParams.get("id");

      const [link, setLink] = useState("");
      const [theoryContent, setTheoryContent] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [currentUser, setCurrentUser] = useState(null); // State for dynamic identity

      // FIX: Load the real student identity from memory
      useEffect(() => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (!storedUser._id) {
                  router.push('/login');
                  return;
            }
            setCurrentUser(storedUser);
      }, [router]);

      const handleHandIn = async () => {
            if (!link && !theoryContent) {
                  return alert("Please provide either a work link or your text-based answer.");
            }

            if (!currentUser) return;

            setIsSubmitting(true);

            const payload = {
                  assignmentId: taskId,
                  // FIX: Using dynamic identity from the logged-in student session
                  studentId: currentUser._id,
                  studentName: currentUser.name,
                  studentEmail: currentUser.email,
                  attachment: link,
                  content: theoryContent,
                  submittedAt: new Date(),
            };

            try {
                  const res = await fetch('/api/submissions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                  });

                  const data = await res.json();

                  if (res.ok && data.success) {
                        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                        setTimeout(() => router.push('/student-dashboard/tasks'), 1500);
                  } else {
                        alert(data.message || "Submission failed");
                        setIsSubmitting(false);
                  }
            } catch (e) {
                  alert("System error. Check connection.");
                  setIsSubmitting(false);
            }
      };

      return (
            <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] w-full max-w-2xl shadow-2xl">

                        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                              <ArrowLeft size={14} /> Back to missions
                        </button>

                        <h2 className="text-2xl font-black italic uppercase text-blue-500 mb-6 tracking-tighter">Submit Your Mission</h2>

                        <div className="space-y-6">
                              <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                          <FileText size={14} /> Answer Theory / Content
                                    </label>
                                    <textarea
                                          placeholder="Type your answer, explanation, or code here..."
                                          value={theoryContent}
                                          onChange={(e) => setTheoryContent(e.target.value)}
                                          className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all min-h-[200px] resize-none font-medium"
                                    />
                              </div>

                              <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                          <LinkIcon size={14} /> Drive / GitHub Attachment (Optional)
                                    </label>
                                    <div className="relative">
                                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                          <input
                                                type="url"
                                                placeholder="https://drive.google.com/..."
                                                value={link}
                                                onChange={(e) => setLink(e.target.value)}
                                                className="w-full bg-black/40 border border-white/5 p-5 pl-12 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all placeholder:text-gray-700"
                                          />
                                    </div>
                              </div>

                              <button
                                    onClick={handleHandIn}
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 p-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-95"
                              >
                                    {isSubmitting ? "UPLOADING TO HUB..." : <><Send size={18} /> Finalise Submission</>}
                              </button>
                        </div>
                  </motion.div>
            </div>
      );
}

export default function Page() {
      return (
            <Suspense fallback={<div className="h-screen bg-[#0f172a] flex items-center justify-center font-black animate-pulse text-blue-500 uppercase tracking-widest">BOOTING UPLINK...</div>}>
                  <SubmitForm />
            </Suspense>
      );
}