"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
      LayoutDashboard,
      BookOpen,
      Trophy,
      MessageCircle,
      User,
      LogOut,
      ChevronDown,
      Briefcase,
      FolderOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function StudentLayout({ children }) {
      const [isProfileOpen, setIsProfileOpen] = useState(false);
      const [userName, setUserName] = useState("Student");
      const pathname = usePathname();
      const router = useRouter();

      useEffect(() => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (storedUser.name) {
                  setUserName(storedUser.name);
            }
      }, []);

      const navItems = [
            { icon: <LayoutDashboard size={20} />, label: "Home", path: "/student-dashboard" },
            { icon: <BookOpen size={20} />, label: "Study", path: "/student-dashboard/lessons" },
            { icon: <Briefcase size={20} />, label: "Tasks", path: "/student-dashboard/tasks" },
            { icon: <Trophy size={20} />, label: "Exams", path: "/student-dashboard/exams" },
            { icon: <FolderOpen size={20} />, label: "Resources", path: "/student-dashboard/resources" },
            { icon: <MessageCircle size={20} />, label: "Chat", path: "/student-dashboard/messages" },
      ];

      return (
            <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
                  <ParticlesBackground />

                  <header className="fixed top-0 w-full z-[150] bg-slate-900/60 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex justify-between items-center">
                        <h1 className="text-xl font-black italic tracking-tighter text-blue-500">
                              RASEL <span className="text-white">ICT</span>
                        </h1>

                        <div className="relative">
                              <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl transition-all hover:bg-white/10"
                              >
                                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-sm uppercase">
                                          {userName.charAt(0)}
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                    {isProfileOpen && (
                                          <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-2 z-[200]"
                                          >
                                                <div className="p-4 border-b border-white/5 mb-2">
                                                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Student Portal</p>
                                                      <p className="font-bold text-blue-400 truncate">@{userName.toLowerCase().replace(/\s+/g, '-')}</p>
                                                </div>
                                                <button className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl text-sm transition-colors">
                                                      <User size={18} className="text-gray-400" /> My Profile
                                                </button>
                                                <button
                                                      onClick={() => {
                                                            localStorage.removeItem("user");
                                                            router.push('/login');
                                                      }}
                                                      className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 text-red-400 rounded-2xl text-sm transition-colors mt-1"
                                                >
                                                      <LogOut size={18} /> Logout System
                                                </button>
                                          </motion.div>
                                    )}
                              </AnimatePresence>
                        </div>
                  </header>

                  <main className="relative z-10 pt-20 pb-28 min-h-screen container mx-auto px-4">
                        {children}
                  </main>

                  <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
                        {navItems.map((item) => {
                              const isActive = pathname === item.path;
                              return (
                                    <Link key={item.path} href={item.path} className="flex-1">
                                          <motion.div
                                                whileTap={{ scale: 0.9 }}
                                                className={`flex flex-col items-center py-2 px-1 rounded-3xl transition-all duration-300 ${isActive
                                                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                                                      : "text-gray-500 hover:text-gray-300"
                                                      }`}
                                          >
                                                {item.icon}
                                                <span className={`text-[8px] font-black uppercase mt-1 tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                                      {item.label}
                                                </span>
                                                {isActive && (
                                                      <motion.div
                                                            layoutId="activeNav"
                                                            className="w-1 h-1 bg-white rounded-full mt-0.5"
                                                      />
                                                )}
                                          </motion.div>
                                    </Link>
                              );
                        })}
                  </nav>
            </div>
      );
}