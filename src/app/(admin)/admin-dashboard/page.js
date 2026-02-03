"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ExternalLink, Activity, Users, BookOpen, X, Save, ShieldCheck, BarChart3, Loader2 } from "lucide-react";

// আগের বানানো চার্ট কম্পোনেন্ট ইম্পোর্ট করো
import AttendanceCharts from "@/components/AttendanceCharts";

export default function AdminDashboard() {
      const [students, setStudents] = useState([]);
      const [loading, setLoading] = useState(true);
      const [editingNode, setEditingNode] = useState(null);
      const [updateLoading, setUpdateLoading] = useState(false);

      // Analytics & Dynamic States
      const [chartData, setChartData] = useState([]);
      const [donutData, setDonutData] = useState([]);
      const [overallRate, setOverallRate] = useState("0");
      const [activeChapters, setActiveChapters] = useState(0); // ডাইনামিক চ্যাপ্টার কাউন্ট

      async function fetchDashboardData() {
            try {
                  // ১. স্টুডেন্ট লিস্ট লোড
                  const res = await fetch('/api/register', { cache: 'no-store' });
                  const data = await res.json();
                  if (data.success) setStudents(data.students || []);

                  // ২. এটেনডেন্স হিস্ট্রি লোড (ক্লাস কাউন্ট করার জন্য)
                  const historyRes = await fetch('/api/attendance/history', { cache: 'no-store' });
                  const historyData = await historyRes.json();
                  if (historyData.success) {
                        setActiveChapters(historyData.records.length); // যতগুলো এটেনডেন্স রেকর্ড, ততগুলো চ্যাপ্টার/ক্লাস
                  }

                  // ৩. এটেনডেন্স অ্যানালিটিক্স লোড
                  const statsRes = await fetch('/api/attendance/stats', { cache: 'no-store' });
                  const statsData = await statsRes.json();
                  if (statsData.success) {
                        setChartData(statsData.chartData);
                        setDonutData(statsData.donutData);

                        const total = statsData.donutData.reduce((acc, curr) => acc + curr.value, 0);
                        const rate = total > 0 ? ((statsData.donutData[0].value / total) * 100).toFixed(1) : "0";
                        setOverallRate(rate);
                  }
            } catch (e) {
                  console.error("Dashboard Data Error:", e.message);
            } finally {
                  setLoading(false);
            }
      }

      useEffect(() => {
            fetchDashboardData();
      }, []);

      const handleUpdateNode = async (e) => {
            e.preventDefault();
            setUpdateLoading(true);
            try {
                  const res = await fetch('/api/register', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              id: editingNode._id,
                              name: editingNode.name,
                              roll: editingNode.roll,
                              college: editingNode.college,
                              email: editingNode.email,
                              phone: editingNode.phone,
                              password: editingNode.password
                        })
                  });
                  const data = await res.json();
                  if (data.success) {
                        alert("Node Credentials Synchronized! 🔐");
                        setEditingNode(null);
                        await fetchDashboardData();
                  }
            } catch (e) {
                  alert("Update Failed!");
            } finally {
                  setUpdateLoading(false);
            }
      };

      return (
            <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 4vw, 32px)', fontFamily: 'var(--font-rajdhani), sans-serif', padding: 'clamp(10px, 2vw, 20px)' }}>

                  {/* Statistics Cards - Fully Responsive Grid  */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
                        <StatCard label="Total Nodes" value={loading ? "..." : students.length} icon={<Users color="#38bdf8" />} />
                        {/* এখন এটা ডাইনামিক */}
                        <StatCard label="Active Sessions" value={loading ? "..." : activeChapters} icon={<BookOpen color="#a855f7" />} />
                        <StatCard label="Live Attendance" value={`${overallRate}%`} icon={<Activity color="#10b981" />} />
                  </div>

                  {/* Visual Analytics Section */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: 'clamp(15px, 3vw, 24px)', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', textTransform: 'uppercase', fontSize: 'clamp(12px, 2vw, 16px)', fontWeight: 'bold', color: '#94a3b8' }}>
                              <BarChart3 size={20} color="#0ea5e9" /> Global_Attendance_Metrics
                        </h3>
                        {chartData.length > 0 ? (
                              <AttendanceCharts data={chartData} donutData={donutData} />
                        ) : (
                              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                    {loading ? <Loader2 className="animate-spin" /> : "Data synchronization required for visualization..."}
                              </div>
                        )}
                  </div>

                  {/* Database Table Container - Responsive Scroll */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '32px', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <h3 style={{ fontStyle: 'italic', fontWeight: '900', textTransform: 'uppercase', margin: 0, color: 'white', fontSize: 'clamp(14px, 2vw, 18px)' }}>Registry Terminal</h3>
                              <button style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>EXPORT CSV</button>
                        </div>

                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
                                    <thead>
                                          <tr style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <th style={{ padding: '20px' }}>Name_Identity</th>
                                                <th style={{ padding: '20px' }}>System_ID</th>
                                                <th style={{ padding: '20px' }}>Institution_College</th>
                                                <th style={{ padding: '20px' }}>Email_Node</th>
                                                <th style={{ padding: '20px' }}>Phone_Link</th>
                                                <th style={{ padding: '20px', textAlign: 'right' }}>Action</th>
                                          </tr>
                                    </thead>
                                    <tbody style={{ color: 'white' }}>
                                          {loading ? (
                                                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="animate-spin" color="#38bdf8" /></td></tr>
                                          ) : students.map((student) => (
                                                <tr key={student._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '14px' }}>
                                                      <td style={{ padding: '20px', color: '#38bdf8', fontWeight: 'bold' }}>{student.name}</td>
                                                      <td style={{ padding: '20px', color: '#94a3b8' }}>#{student.roll || 'N/A'}</td>
                                                      <td style={{ padding: '20px', color: '#94a3b8' }}>{student.college || "N/A"}</td>
                                                      <td style={{ padding: '20px', color: '#94a3b8' }}>{student.email}</td>
                                                      <td style={{ padding: '20px', color: '#94a3b8' }}>{student.phone || 'N/A'}</td>
                                                      <td style={{ padding: '20px', textAlign: 'right' }}>
                                                            <button onClick={() => setEditingNode({ ...student, password: '' })} style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>EDIT_ACCESS</button>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>

                  {/* Edit Modal - Responsive Fix */}
                  <AnimatePresence>
                        {editingNode && (
                              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'clamp(10px, 4vw, 20px)' }}>
                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: 'clamp(20px, 5vw, 40px)', position: 'relative', maxHeight: '95vh', overflowY: 'auto' }}>
                                          <button onClick={() => setEditingNode(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
                                          <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#38bdf8', marginBottom: '24px', textTransform: 'uppercase' }}>MASTER_EDIT_PROTOCOL</h3>
                                          <form onSubmit={handleUpdateNode} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                                <EditInput label="Name" value={editingNode.name} onChange={(v) => setEditingNode({ ...editingNode, name: v })} />
                                                <EditInput label="Roll/ID" value={editingNode.roll} onChange={(v) => setEditingNode({ ...editingNode, roll: v })} />
                                                <EditInput label="Email" type="email" value={editingNode.email} onChange={(v) => setEditingNode({ ...editingNode, email: v })} />
                                                <EditInput label="Phone" value={editingNode.phone} onChange={(v) => setEditingNode({ ...editingNode, phone: v })} />
                                                <EditInput label="College" value={editingNode.college} onChange={(v) => setEditingNode({ ...editingNode, college: v })} span={2} />
                                                <EditInput label="New Password" type="text" value={editingNode.password} onChange={(v) => setEditingNode({ ...editingNode, password: v })} span={2} />
                                                <button type="submit" disabled={updateLoading} style={{ gridColumn: '1 / -1', marginTop: '10px', padding: '16px', backgroundColor: '#0ea5e9', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}>
                                                      {updateLoading ? "SYNCHRONIZING..." : "OVERWRITE NODE DATA"}
                                                </button>
                                          </form>
                                    </motion.div>
                              </div>
                        )}
                  </AnimatePresence>
            </div>
      );
}

function StatCard({ label, value, icon }) {
      return (
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: 'clamp(20px, 4vw, 32px)', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', margin: 0, fontWeight: 'bold' }}>{label}</p>
                        <h4 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '900', margin: '5px 0', color: 'white' }}>{value}</h4>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}>{icon}</div>
            </div>
      );
}

function EditInput({ label, value, onChange, type = "text", span = 1 }) {
      return (
            <div style={{ gridColumn: `span ${span}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</label>
                  <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} style={{ padding: '12px', backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: 'white', outline: 'none', width: '100%' }} />
            </div>
      );
}