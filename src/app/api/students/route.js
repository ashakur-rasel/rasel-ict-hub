"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
      Rocket, BookOpen, CheckCircle, Clock,
      Trophy, Bell, LayoutDashboard, MessageCircle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import confetti from 'canvas-confetti';

export default function StudentDashboard() {
      const [data, setData] = useState(null);
      const studentId = "LOGGED_IN_STUDENT_ID"; // Get this from your Auth context

      useEffect(() => {
            fetch(`/api/student/dashboard-stats?studentId=${studentId}`)
                  .then(res => res.json())
                  .then(json => {
                        if (json.success) {
                              setData(json);
                              if (json.stats.attendanceRate > 90) confetti(); // Paper blast for high attendance
                        }
                  });
      }, []);

      if (!data) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Initializing System...</div>;

      return (
            <div className="min-h-screen bg-[#0f172a] text-white pb-24">
                  {/* Header Section */}
                  <header className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-[2.5rem] shadow-xl">
                        <motion.div
                              initial={{ x: -50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="flex justify-between items-center"
                        >
                              <div>
                                    <h1 className="text-2xl font-black italic">ICT HUB PORTAL</h1>
                                    <p className="text-blue-100 text-sm">Welcome back, Super Learner! 🚀</p>
                              </div>
                              <div className="bg-white/20 p-3 rounded-2xl relative">
                                    <Bell size={24} />
                                    {data.notice && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-blue-600" />}
                              </div>
                        </motion.div>
                  </header>

                  <main className="p-4 md:p-8 space-y-6">
                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <StatCard icon={<CheckCircle className="text-emerald-400" />} label="Attendance" value={`${data.stats.attendanceRate}%`} color="border-emerald-500/20" />
                              <StatCard icon={<Trophy className="text-yellow-400" />} label="Avg Score" value={data.stats.avgScore} color="border-yellow-500/20" />
                              <StatCard icon={<Clock className="text-rose-400" />} label="Pending" value={data.stats.pendingTasks} color="border-rose-500/20" />
                              <StatCard icon={<Rocket className="text-blue-400" />} label="Rank" value="#1" color="border-blue-500/20" />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem]">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📊 Attendance Flow</h3>
                                    <div className="h-48">
                                          <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                      <Pie data={data.chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                            <Cell fill="#10b981" />
                                                            <Cell fill="#1e293b" />
                                                      </Pie>
                                                      <Tooltip />
                                                </PieChart>
                                          </ResponsiveContainer>
                                    </div>
                              </motion.div>

                              <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 border border-white/5 p-6 rounded-[2rem]">
                                    <h3 className="text-lg font-bold mb-4">🏆 Leaderboard (Top 5)</h3>
                                    <div className="space-y-3">
                                          {data.leaderboard.map((user, i) => (
                                                <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                                                      <span className="text-sm font-bold">{i + 1}. {user._id}</span>
                                                      <span className="text-blue-400 font-black">{user.totalScore} pts</span>
                                                </div>
                                          ))}
                                    </div>
                              </motion.div>
                        </div>
                  </main>

                  {/* Mobile Sticky Navigation */}
                  <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-full flex justify-around items-center shadow-2xl z-50">
                        <NavIcon icon={<LayoutDashboard />} label="Home" active />
                        <NavIcon icon={<BookOpen />} label="Study" />
                        <NavIcon icon={<MessageCircle />} label="Chat" />
                        <NavIcon icon={<Trophy />} label="Exams" />
                  </nav>
            </div>
      );
}

function StatCard({ icon, label, value, color }) {
      return (
            <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`bg-slate-900 border ${color} p-4 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg`}
            >
                  <div className="mb-2">{icon}</div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</p>
                  <p className="text-xl font-black">{value}</p>
            </motion.div>
      );
}

function NavIcon({ icon, label, active = false }) {
      return (
            <div className={`flex flex-col items-center p-3 rounded-full transition-all ${active ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
                  {icon}
                  <span className="text-[8px] font-bold uppercase mt-1">{label}</span>
            </div>
      );
}