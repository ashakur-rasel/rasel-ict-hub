"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookOpen, Trophy, MessageCircle, User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function StudentLayout({ children }) {
      const [isProfileOpen, setIsProfileOpen] = useState(false);
      const pathname = usePathname();
      const router = useRouter();

      const navItems = [
            { icon: <LayoutDashboard />, label: "Home", path: "/student-dashboard" },
            { icon: <BookOpen />, label: "Study", path: "/student-dashboard/lessons" },
            { icon: <Trophy />, label: "Exams", path: "/student-dashboard/exams" },
            { icon: <MessageCircle />, label: "Chat", path: "/student-dashboard/messages" },
      ];

      return (
            <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
                  <ParticlesBackground />

                  {/* Fixed Top Header */}
                  <header className="fixed top-0 w-full z-[100] bg-slate-900/60 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex justify-between items-center">
                        <h1 className="text-xl font-black italic tracking-tighter text-blue-500">RASEL <span className="text-white">ICT</span></h1>

                        <div className="relative">
                              <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl"
                              >
                                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold">R</div>
                                    <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                    {isProfileOpen && (
                                          <motion.div
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-2"
                                          >
                                                <div className="p-4 border-b border-white/5 mb-2">
                                                      <p className="text-xs font-black text-gray-500 uppercase">Student Portal</p>
                                                      <p className="font-bold text-blue-400">@rasel_ict</p>
                                                </div>
                                                <button className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl text-sm transition-colors"><User size={18} /> My Profile</button>
                                                <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 text-red-400 rounded-2xl text-sm transition-colors mt-1"><LogOut size={18} /> Logout System</button>
                                          </motion.div>
                                    )}
                              </AnimatePresence>
                        </div>
                  </header>

                  <main className="relative z-10 pt-20 pb-28 min-h-screen">{children}</main>

                  {/* Persistent Mobile Navigation */}
                  <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-full flex justify-around items-center shadow-2xl z-50">
                        {navItems.map((item) => (
                              <Link key={item.path} href={item.path}>
                                    <motion.div whileTap={{ scale: 0.9 }} className={`flex flex-col items-center p-3 rounded-full transition-all ${pathname === item.path ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "text-gray-500"}`}>
                                          {item.icon}
                                          <span className="text-[9px] font-black uppercase mt-1 tracking-widest">{item.label}</span>
                                    </motion.div>
                              </Link>
                        ))}
                  </nav>
            </div>
      );
}