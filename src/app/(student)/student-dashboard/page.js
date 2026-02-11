"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Trophy, Clock, CheckCircle, Bell, Video, Zap, Target, Flame, TrendingUp, Layers } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, ComposedChart, Cell, PieChart, Pie } from 'recharts';
import confetti from 'canvas-confetti';

export default function StudentDashboard() {
      const [data, setData] = useState(null);
      const studentId = "698191543aca7a7841264ed7"; // Use dynamic session ID here

      useEffect(() => {
            fetch(`/api/student/dashboard-stats?studentId=${studentId}`)
                  .then(res => res.json())
                  .then(json => {
                        if (json.success) {
                              setData(json);
                              if (parseFloat(json.stats.attendanceRate) > 80) {
                                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 }, colors: ['#3b82f6', '#10b981', '#ff00ff'] });
                              }
                        }
                  });
      }, []);

      if (!data) return (
            <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center space-y-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                        <Zap size={48} className="text-blue-500" />
                  </motion.div>
                  <p className="font-black text-white tracking-[0.3em] animate-pulse">BOOTING ICT HUB...</p>
            </div>
      );

      // --- Real Data Calculations ---
      const completedLocal = JSON.parse(localStorage.getItem("completedTopics") || "[]").length;

      const lnsPercent = data.stats.totalSections > 0 ? (completedLocal / data.stats.totalSections) * 100 : 0;
      const exmPercent = data.stats.totalExamsAvailable > 0 ? (data.stats.examsCompleted / data.stats.totalExamsAvailable) * 100 : 0;
      const tskPercent = data.stats.totalAssignments > 0 ? (data.stats.mySubmissions / data.stats.totalAssignments) * 100 : 0;

      // Chart 1: Competitive Velocity (Restored)
      const velocityData = [
            { subject: 'Lessons', A: Math.round(lnsPercent), fullMark: 100 },
            { subject: 'Exams', A: Math.round(exmPercent), fullMark: 100 },
            { subject: 'Tasks', A: Math.round(tskPercent), fullMark: 100 },
            { subject: 'Attendance', A: parseFloat(data.stats.attendanceRate), fullMark: 100 },
            { subject: 'XP', A: 75, fullMark: 100 },
      ];

      // Chart 2: Milestones (Restored)
      const milestoneData = [
            { name: 'Lessons', val: Math.round(lnsPercent) },
            { name: 'Exams', val: Math.round(exmPercent) },
            { name: 'Tasks', val: Math.round(tskPercent) }
      ];

      // Chart 3: Syllabus Mastery (New)
      const syllabusData = [
            { name: 'Chapters', total: data.stats.totalChapters, completed: Math.round(data.stats.totalChapters * (lnsPercent / 100)) },
            { name: 'Sections', total: data.stats.totalSections, completed: completedLocal },
      ];

      return (
            <div className="p-4 space-y-6 max-w-5xl mx-auto">
                  {/* Live Alert */}
                  {data.config?.isLive && (
                        <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="bg-red-500 p-4 rounded-[2rem] flex items-center justify-between shadow-lg shadow-red-500/20">
                              <div className="flex items-center gap-3 text-white">
                                    <div className="bg-white p-2 rounded-full animate-ping"><Video size={16} className="text-red-500" /></div>
                                    <p className="font-black text-sm italic uppercase tracking-tighter">Live Class is Active!</p>
                              </div>
                              <a href={data.config.liveLink} target="_blank" className="bg-white text-red-500 px-6 py-2 rounded-full font-black text-xs">JOIN NOW</a>
                        </motion.div>
                  )}

                  {/* Hero Competition Card */}
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-900 p-8 rounded-[3rem] relative overflow-hidden shadow-2xl border border-white/10">
                        <div className="relative z-10 space-y-4">
                              <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-1 rounded-full border border-white/5">
                                    <Flame size={16} className="text-orange-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Syllabus Master Level</span>
                              </div>
                              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Top Performance</h2>

                              <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-blue-200 uppercase">
                                          <span>Overall Mastery</span>
                                          <span>{Math.round(lnsPercent)}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
                                          <motion.div initial={{ width: 0 }} animate={{ width: `${lnsPercent}%` }} transition={{ duration: 1.5 }} className="h-full bg-gradient-to-r from-blue-400 to-purple-500" />
                                    </div>
                              </div>

                              <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                                    <Bell className="text-yellow-400" size={18} />
                                    <marquee className="text-[10px] font-bold uppercase tracking-widest text-blue-100">{data.config?.globalNotice}</marquee>
                              </div>
                        </div>
                        <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -right-6 -bottom-6 text-white/5 opacity-40 rotate-12">
                              <Rocket size={220} />
                        </motion.div>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Present" value={data.stats.totalPresent} icon={<CheckCircle size={22} />} color="emerald" />
                        <StatCard label="Attendance" value={`${data.stats.attendanceRate}%`} icon={<Zap size={22} />} color="blue" />
                        <StatCard label="Avg Score" value={data.stats.avgScore} icon={<Trophy size={22} />} color="yellow" />
                        <StatCard label="Tasks" value={data.stats.pendingTasks} icon={<Target size={22} />} color="rose" />
                  </div>

                  {/* NEW: Comprehensive Syllabus Mastery Graph */}
                  <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <h3 className="font-black italic text-blue-400 uppercase text-xs tracking-[0.3em] flex items-center gap-3 mb-8">
                              <Layers size={20} /> Syllabus Depth (Chapter vs Section)
                        </h3>
                        <div className="h-72 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={syllabusData}>
                                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontWeight: 'bold' }} />
                                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '15px', border: 'none' }} />
                                          <Bar dataKey="total" barSize={60} fill="#1e293b" radius={[15, 15, 15, 15]} />
                                          <Bar dataKey="completed" barSize={60} fill="#3b82f6" radius={[15, 15, 15, 15]} />
                                    </ComposedChart>
                              </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                              <MiniData label="Remaining Chapters" value={data.stats.totalChapters - Math.round(data.stats.totalChapters * (lnsPercent / 100))} color="text-rose-400" />
                              <MiniData label="Total Sections" value={data.stats.totalSections} color="text-blue-400" />
                              <MiniData label="Sections Done" value={completedLocal} color="text-emerald-400" />
                              <MiniData label="Course Rank" value="#1" color="text-yellow-400" />
                        </div>
                  </div>

                  {/* Restored Charts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                        {/* Competitive Velocity Radar */}
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                              <h3 className="font-black italic text-purple-400 uppercase text-[10px] mb-8 tracking-[0.4em] flex items-center gap-2">
                                    <TrendingUp size={14} /> Competitive Velocity
                              </h3>
                              <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={velocityData}>
                                                <PolarGrid stroke="#1e293b" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                                                <Radar name="Student" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                                          </RadarChart>
                                    </ResponsiveContainer>
                              </div>
                        </div>

                        {/* Milestones Reached Bar Chart */}
                        <div className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
                              <h3 className="font-black italic text-emerald-400 uppercase text-[10px] mb-8 tracking-[0.4em] flex items-center gap-2">
                                    <Target size={14} /> Milestones (Lessons/Exam/Tasks)
                              </h3>
                              <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                          <BarChart data={milestoneData}>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#fdcd6d', fontSize: 10, fontWeight: 900 }} />
                                                <Bar dataKey="val" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
                                                <Tooltip cursor={{ fill: 'transparent' }} />
                                          </BarChart>
                                    </ResponsiveContainer>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

function StatCard({ label, value, icon, color }) {
      const colors = {
            emerald: "text-emerald-400 border-emerald-500/10",
            blue: "text-blue-400 border-blue-500/10",
            yellow: "text-yellow-400 border-yellow-500/10",
            rose: "text-rose-400 border-rose-500/10"
      };
      return (
            <div className={`bg-slate-900 border p-6 rounded-[2.5rem] flex flex-col items-center gap-3 ${colors[color]}`}>
                  <div className="bg-white/5 p-4 rounded-[1.5rem]">{icon}</div>
                  <div className="text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">{label}</p>
                        <p className="text-3xl font-black text-white">{value}</p>
                  </div>
            </div>
      );
}

function MiniData({ label, value, color }) {
      return (
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <p className={`text-xl font-black ${color}`}>{value}</p>
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1 leading-tight">{label}</p>
            </div>
      );
}