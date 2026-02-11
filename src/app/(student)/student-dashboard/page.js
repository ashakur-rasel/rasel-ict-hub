"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Trophy, CheckCircle, Video, Zap, Target, Flame, TrendingUp, Layers, Bell, ArrowRight, FolderOpen } from "lucide-react";
import { ResponsiveContainer, XAxis, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarArea, Bar, BarChart, ComposedChart } from 'recharts';
import confetti from 'canvas-confetti';
import Link from "next/link";

export default function StudentDashboard() {
      const [data, setData] = useState(null);
      const [pendingCount, setPendingCount] = useState(0);

      useEffect(() => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const dynamicId = storedUser._id;
            const studentEmail = storedUser.email;

            if (!dynamicId) {
                  window.location.href = "/login";
                  return;
            }

            const fetchDashboardData = async () => {
                  try {
                        const [statsRes, assignRes, subRes] = await Promise.all([
                              fetch(`/api/student/dashboard-stats?studentId=${dynamicId}`),
                              fetch('/api/assignments'),
                              fetch(`/api/submissions?studentEmail=${studentEmail}`)
                        ]);

                        const statsJson = await statsRes.json();
                        const assignJson = await assignRes.json();
                        const subJson = await subRes.json();

                        if (statsJson.success) {
                              setData(statsJson);

                              const allAssignments = assignJson.assignments || assignJson.data || [];
                              const mySubmissions = subJson.data || [];

                              const pending = allAssignments.filter(task => {
                                    const hasSubmission = mySubmissions.some(s =>
                                          (s.assignmentId?._id || s.assignmentId) === task._id
                                    );
                                    return !hasSubmission;
                              }).length;

                              setPendingCount(pending);

                              if (parseFloat(statsJson.stats.attendanceRate) > 80) {
                                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 }, colors: ['#3b82f6', '#10b981', '#ff00ff'] });
                              }
                        }
                  } catch (error) {
                        console.error(error);
                  }
            };

            fetchDashboardData();
      }, []);

      if (!data) return (
            <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center space-y-4 text-center p-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                        <Zap size={48} className="text-blue-500" />
                  </motion.div>
                  <p className="font-black text-white tracking-[0.3em] animate-pulse text-xs uppercase">Initialising System...</p>
            </div>
      );

      const completedLocal = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("completedTopics") || "[]").length : 0;
      const lnsPercent = data.stats.totalSections > 0 ? (completedLocal / data.stats.totalSections) * 100 : 0;
      const exmPercent = data.stats.totalExamsAvailable > 0 ? (data.stats.examsCompleted / data.stats.totalExamsAvailable) * 100 : 0;
      const completedTasks = data.stats.totalAssignments - pendingCount;
      const tskPercent = data.stats.totalAssignments > 0 ? (completedTasks / data.stats.totalAssignments) * 100 : 0;

      const velocityData = [
            { subject: 'Lessons', A: Math.round(lnsPercent) },
            { subject: 'Exams', A: Math.round(exmPercent) },
            { subject: 'Tasks', A: Math.round(tskPercent) },
            { subject: 'Attendance', A: parseFloat(data.stats.attendanceRate) },
            { subject: 'XP', A: 75 },
      ];

      const syllabusData = [
            { name: 'Chapters', total: data.stats.totalChapters, completed: Math.round(data.stats.totalChapters * (lnsPercent / 100)) },
            { name: 'Sections', total: data.stats.totalSections, completed: completedLocal },
      ];

      return (
            <div className="p-4 space-y-6 max-w-6xl mx-auto pb-32 md:pt-10">
                  {data.config?.isLive && (
                        <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="bg-red-500 p-4 rounded-3xl flex items-center justify-between shadow-lg shadow-red-500/20 border border-white/10">
                              <div className="flex items-center gap-3 text-white">
                                    <div className="bg-white p-2 rounded-full animate-ping"><Video size={16} className="text-red-500" /></div>
                                    <p className="font-black text-[10px] md:text-sm italic uppercase tracking-tighter leading-none">Broadcast active</p>
                              </div>
                              <a href={data.config.liveLink} target="_blank" className="bg-white text-red-500 px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-transform">Join</a>
                        </motion.div>
                  )}

                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-900 p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-white/10">
                        <div className="relative z-10 space-y-4">
                              <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                                    <Flame size={14} className="text-orange-400" />
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white">Mastery Level</span>
                              </div>
                              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">Top Performance</h2>

                              <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-[9px] font-black text-blue-200 uppercase tracking-widest">
                                          <span>Progression</span>
                                          <span>{Math.round(lnsPercent)}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
                                          <motion.div initial={{ width: 0 }} animate={{ width: `${lnsPercent}%` }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-blue-400 to-purple-500" />
                                    </div>
                              </div>

                              <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                                    <Bell className="text-yellow-400 shrink-0" size={16} />
                                    <marquee className="text-[9px] font-bold uppercase tracking-widest text-blue-100">{data.config?.globalNotice || "Secure Connection Established"}</marquee>
                              </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 text-white/5 opacity-30 rotate-12 pointer-events-none">
                              <Rocket size={200} className="md:w-[280px] md:h-[280px]" />
                        </div>
                  </motion.div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Present" value={data.stats.totalPresent} icon={<CheckCircle size={20} />} color="emerald" />
                        <StatCard label="Attendance" value={`${data.stats.attendanceRate}%`} icon={<Zap size={20} />} color="blue" />
                        <Link href="/student-dashboard/exams" className="block active:scale-95 transition-transform">
                              <StatCard label="Score" value={data.stats.avgScore} icon={<Trophy size={20} />} color="yellow" isLink />
                        </Link>
                        <Link href="/student-dashboard/tasks" className="block active:scale-95 transition-transform">
                              <StatCard label="Tasks" value={pendingCount} icon={<Target size={20} />} color="rose" isLink />
                        </Link>
                  </div>

                  <div className="bg-[#0f172a] border border-white/5 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <h3 className="font-black italic text-blue-400 uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 mb-8">
                              <Layers size={18} /> Syllabus Depth
                        </h3>
                        <div className="h-64 md:h-80 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={syllabusData}>
                                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontWeight: 'bold', fontSize: 10 }} />
                                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', borderRadius: '15px', border: 'none', fontSize: '10px' }} />
                                          <Bar dataKey="total" barSize={40} fill="#1e293b" radius={[10, 10, 10, 10]} />
                                          <Bar dataKey="completed" barSize={40} fill="#3b82f6" radius={[10, 10, 10, 10]} />
                                    </ComposedChart>
                              </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                              <div className="grid grid-cols-2 gap-4 md:contents">
                                    <MiniData label="Remaining" value={data.stats.totalChapters - Math.round(data.stats.totalChapters * (lnsPercent / 100))} color="text-rose-400" />
                                    <MiniData label="Completed" value={completedLocal} color="text-emerald-400" />
                              </div>
                              <Link href="/student-dashboard/resources" className="md:col-span-2">
                                    <div className="bg-blue-600/10 p-5 rounded-3xl border border-blue-500/20 flex items-center justify-between group h-full hover:bg-blue-600/20 transition-all">
                                          <div className="flex items-center gap-3">
                                                <FolderOpen className="text-blue-400" size={20} />
                                                <span className="text-[10px] font-black uppercase text-blue-100 tracking-widest">Resource Vault</span>
                                          </div>
                                          <ArrowRight size={18} className="text-blue-400 group-hover:translate-x-2 transition-transform" />
                                    </div>
                              </Link>
                        </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                        <div className="bg-[#0f172a] border border-white/5 p-6 md:p-10 rounded-[2.5rem] shadow-xl">
                              <h3 className="font-black italic text-purple-400 uppercase text-[9px] mb-8 tracking-[0.4em] flex items-center gap-2">
                                    <TrendingUp size={16} /> Velocity Analysis
                              </h3>
                              <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={velocityData}>
                                                <PolarGrid stroke="#1e293b" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 800 }} />
                                                <RadarArea name="Data" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                                          </RadarChart>
                                    </ResponsiveContainer>
                              </div>
                        </div>

                        <div className="bg-[#0f172a] border border-white/5 p-6 md:p-10 rounded-[2.5rem] shadow-xl">
                              <h3 className="font-black italic text-emerald-400 uppercase text-[9px] mb-8 tracking-[0.4em] flex items-center gap-2">
                                    <Target size={16} /> Activity Monitor
                              </h3>
                              <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={[
                                                { name: 'Lessons', val: Math.round(lnsPercent) },
                                                { name: 'Exams', val: Math.round(exmPercent) },
                                                { name: 'Tasks', val: Math.round(tskPercent) }
                                          ]}>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                                <Bar dataKey="val" fill="#10b981" radius={[10, 10, 0, 0]} barSize={35} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                                          </BarChart>
                                    </ResponsiveContainer>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

function StatCard({ label, value, icon, color, isLink }) {
      const colors = {
            emerald: "text-emerald-400 border-emerald-500/10",
            blue: "text-blue-400 border-blue-500/10",
            yellow: "text-yellow-400 border-yellow-500/10",
            rose: "text-rose-400 border-rose-500/10"
      };
      return (
            <div className={`bg-[#0f172a] border p-5 md:p-6 rounded-3xl flex flex-col items-center gap-3 transition-all ${isLink ? 'hover:bg-white/5 border-white/10' : ''} ${colors[color]}`}>
                  <div className="bg-white/5 p-3 md:p-4 rounded-2xl">{icon}</div>
                  <div className="text-center">
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1 leading-none">{label}</p>
                        <p className="text-xl md:text-3xl font-black text-white leading-none mt-1">{value}</p>
                  </div>
            </div>
      );
}

function MiniData({ label, value, color }) {
      return (
            <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center flex-1">
                  <p className={`text-lg md:text-2xl font-black ${color} leading-none`}>{value}</p>
                  <p className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-widest mt-2 leading-tight">{label}</p>
            </div>
      );
}