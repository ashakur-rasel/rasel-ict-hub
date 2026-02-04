"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
      Activity, Users, BookOpen, X, BarChart3,
      Loader2, Zap, Trophy, Target, Globe, ArrowLeft,
      Mail, Phone, School, TrendingUp, AlertCircle, FileSpreadsheet, Edit3, Save, Star, Award
} from "lucide-react";

import AttendanceCharts from "@/components/AttendanceCharts";

export default function AdminDashboard() {
      const [students, setStudents] = useState([]);
      const [loading, setLoading] = useState(true);
      const [selectedStudentReport, setSelectedStudentReport] = useState(null);
      const [reportLoading, setReportLoading] = useState(false);
      const [reportData, setReportData] = useState({ attendance: 0, examAvg: 0, assignments: 0, totalAssignments: 0 });
      const [editingNode, setEditingNode] = useState(null);
      const [updateLoading, setUpdateLoading] = useState(false);

      const [chartData, setChartData] = useState([]);
      const [donutData, setDonutData] = useState([]);
      const [overallRate, setOverallRate] = useState("0");
      const [activeChapters, setActiveChapters] = useState(0);

      const [topAttendance, setTopAttendance] = useState(null);
      const [topExam, setTopExam] = useState(null);
      const [topAssignment, setTopAssignment] = useState(null);

      const [performance, setPerformance] = useState({ assignments: 0, exams: 0, interaction: 0 });

      async function fetchDashboardData() {
            try {
                  const res = await fetch('/api/register', { cache: 'no-store' });
                  const data = await res.json();
                  const studentList = data.success ? data.students : [];
                  setStudents(studentList);

                  const historyRes = await fetch('/api/attendance/history', { cache: 'no-store' });
                  const historyData = await historyRes.json();

                  const resultsRes = await fetch('/api/results');
                  const resultsData = await resultsRes.json();

                  // ১. Attendance Ranking Logic
                  if (historyData.success && historyData.records.length > 0) {
                        const records = historyData.records;
                        setActiveChapters(records.length);

                        const attMap = {};
                        records.forEach(day => {
                              day.students.forEach(s => {
                                    if (s.status === "Present") attMap[s.studentId] = (attMap[s.studentId] || 0) + 1;
                              });
                        });

                        const bestAttId = Object.keys(attMap).reduce((a, b) => attMap[a] > attMap[b] ? a : b, null);
                        if (bestAttId) setTopAttendance(studentList.find(s => String(s._id) === String(bestAttId)));

                        let totalP = 0;
                        records.forEach(d => d.students.forEach(s => { if (s.status === "Present") totalP++ }));
                        const rate = ((totalP / (records.length * studentList.length)) * 100).toFixed(1);
                        setOverallRate(rate);
                        setPerformance(prev => ({ ...prev, interaction: parseFloat(rate) }));
                  }

                  // ২. Exam Ranking Logic (Dynamic)
                  if (resultsData.success && resultsData.results?.length > 0) {
                        const sortedResults = [...resultsData.results].sort((a, b) => b.score - a.score);
                        const bestExam = sortedResults[0];
                        setTopExam(studentList.find(s => s.studentId === bestExam.studentId));

                        const avgExam = (resultsData.results.reduce((acc, r) => acc + (r.score / r.totalQuestions), 0) / resultsData.results.length * 100).toFixed(0);
                        setPerformance(prev => ({ ...prev, exams: parseFloat(avgExam) }));
                  } else {
                        setTopExam(null); // ডাটা না থাকলে নাল
                  }

                  // ৩. Assignment Ranking (Future Placeholder)
                  setTopAssignment(null);

                  const statsRes = await fetch('/api/attendance/stats', { cache: 'no-store' });
                  const statsData = await statsRes.json();
                  if (statsData.success) {
                        setChartData(statsData.chartData || []);
                        setDonutData(statsData.donutData || []);
                  }
            } catch (e) { console.error("Sync Error"); }
            finally { setLoading(false); }
      }

      const calculateRealAttendance = async (studentMongoId) => {
            try {
                  const res = await fetch('/api/attendance/history');
                  const data = await res.json();
                  if (data.success && data.records.length > 0) {
                        const daysPresent = data.records.filter(day =>
                              day.students.some(s => String(s.studentId) === String(studentMongoId) && s.status === "Present")
                        ).length;
                        return ((daysPresent / data.records.length) * 100).toFixed(1);
                  }
                  return 0;
            } catch (e) { return 0; }
      };

      const handleStudentClick = async (student) => {
            setSelectedStudentReport(student);
            setReportLoading(true);
            const realRate = await calculateRealAttendance(student._id);
            setReportData({ attendance: realRate, examAvg: 0, assignments: 0, totalAssignments: 0 });
            setReportLoading(false);
      };

      const handleUpdateNode = async (e) => {
            e.preventDefault();
            setUpdateLoading(true);
            try {
                  const res = await fetch('/api/register', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editingNode)
                  });
                  if (res.ok) {
                        alert("NODE_SYNCHRONIZED");
                        setEditingNode(null);
                        fetchDashboardData();
                  }
            } catch (e) { alert("SYNC_FAILED"); }
            finally { setUpdateLoading(false); }
      };

      const exportToCSV = () => {
            const headers = "Name,Roll,College,Email,Phone\n";
            const rows = students.map(s => `${s.name},${s.studentId},${s.college || 'N/A'},${s.email},${s.phone || 'N/A'}`).join("\n");
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'registry_data.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
      };

      useEffect(() => { fetchDashboardData(); }, []);

      return (
            <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'var(--font-rajdhani), sans-serif', padding: '10px' }}>

                  <AnimatePresence mode="wait">
                        {!selectedStudentReport ? (
                              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
                                          <StatCard label="Total Nodes" value={loading ? "..." : students.length} icon={<Users size={30} color="#0ea5e9" />} trend="Network_Active" color="#0ea5e9" />
                                          <StatCard label="Total Sessions" value={loading ? "..." : activeChapters} icon={<Zap size={30} color="#f59e0b" />} trend="Live_Archive" color="#f59e0b" />
                                          <StatCard label="Avg. Attendance" value={`${overallRate}%`} icon={<Activity size={30} color="#10b981" />} trend="Sync_Stable" color="#10b981" />
                                          <StatCard label="Integrity" value="100%" icon={<Target size={30} color="#ef4444" />} trend="Secure_Protocol" color="#ef4444" />
                                    </div>

                                    {/* Rank Hub - Only Dynamic Data */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                          <TopStationCard title="ATTENDANCE_KING" name={topAttendance?.name} id={topAttendance?.studentId} color="#10b981" icon={<Trophy size={24} />} />
                                          <TopStationCard title="EXAM_TOPPER" name={topExam?.name} id={topExam?.studentId} color="#3b82f6" icon={<Star size={24} />} />
                                          <TopStationCard title="ASSIGNMENT_PRO" name={topAssignment?.name} id={topAssignment?.studentId} color="#a855f7" icon={<Award size={24} />} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 600px), 1fr))', gap: '30px' }}>
                                          <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '35px', border: '1px solid #1e293b' }}>
                                                <h3 style={{ textTransform: 'uppercase', fontSize: '14px', fontWeight: '900', color: '#38bdf8', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                      <BarChart3 size={20} /> ATTENDANCE_LOG_GRAPH
                                                </h3>
                                                {chartData.length > 0 ? <AttendanceCharts data={chartData} donutData={donutData} /> : <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>{loading ? <Loader2 className="animate-spin" /> : "DATA_FEED_NULL"}</div>}
                                          </div>

                                          <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '35px', border: '1px solid #1e293b' }}>
                                                <h3 style={{ textTransform: 'uppercase', fontSize: '14px', fontWeight: '900', color: '#a855f7', marginBottom: '25px' }}>SYSTEM_DYNAMICS</h3>
                                                <ProgressBar label="Assignment Sync" value={performance.assignments} color="#a855f7" />
                                                <ProgressBar label="Exam Accuracy" value={performance.exams} color="#0ea5e9" />
                                                <ProgressBar label="Interaction Rate" value={performance.interaction} color="#10b981" />
                                          </div>
                                    </div>

                                    <div style={{ backgroundColor: '#0f172a', border: '2px solid #1e293b', borderRadius: '40px', overflow: 'hidden' }}>
                                          <div style={{ padding: '20px 30px', backgroundColor: '#1e293b', color: '#38bdf8', fontWeight: '900', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>STUDENT_REGISTRY_TERMINAL</span>
                                                <button onClick={exportToCSV} style={{ background: '#10b981', color: '#020617', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                      <FileSpreadsheet size={16} /> EXPORT_CSV
                                                </button>
                                          </div>
                                          <div style={{ overflowX: 'auto' }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                                                      <thead>
                                                            <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>
                                                                  <th style={{ padding: '20px' }}>Identity_Node</th>
                                                                  <th style={{ padding: '20px' }}>Roll_Number</th>
                                                                  <th style={{ padding: '20px' }}>College_Institution</th>
                                                                  <th style={{ padding: '20px' }}>Contact_Link</th>
                                                                  <th style={{ padding: '20px' }}>Phone_Module</th>
                                                                  <th style={{ padding: '20px', textAlign: 'right' }}>Management</th>
                                                            </tr>
                                                      </thead>
                                                      <tbody>
                                                            {students.map((student) => (
                                                                  <tr key={student._id} style={{ borderBottom: '1px solid #1e293b' }}>
                                                                        <td style={{ padding: '15px 20px' }}>
                                                                              <button onClick={() => handleStudentClick(student)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: 0 }}>
                                                                                    <div style={{ width: '35px', height: '35px', borderRadius: '10px', backgroundColor: '#3b82f6', color: "white", display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>{student.name[0]}</div>
                                                                                    <div>
                                                                                          <span style={{ fontWeight: '800', color: "white", display: 'block' }}>{student.name}</span>
                                                                                          <span style={{ fontSize: '10px', color: '#0ea5e9' }}>OPEN_REPORT</span>
                                                                                    </div>
                                                                              </button>
                                                                        </td>
                                                                        <td style={{ padding: '20px', color: '#38bdf8', fontWeight: '900' }}>{student.studentId}</td>
                                                                        <td style={{ padding: '20px', color: '#cbd5e1' }}>{student.college || "N/A"}</td>
                                                                        <td style={{ padding: '20px', color: '#cbd5e1' }}>{student.email}</td>
                                                                        <td style={{ padding: '20px', color: '#cbd5e1' }}>{student.phone || "N/A"}</td>
                                                                        <td style={{ padding: '20px', textAlign: 'right' }}>
                                                                              <button onClick={() => setEditingNode({ ...student, password: "" })} style={{ background: 'transparent', border: '2px solid #38bdf8', color: '#38bdf8', padding: '8px 15px', borderRadius: '12px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}><Edit3 size={14} /></button>
                                                                        </td>
                                                                  </tr>
                                                            ))}
                                                      </tbody>
                                                </table>
                                          </div>
                                    </div>
                              </motion.div>
                        ) : (
                              /* --- Profile View --- */
                              <motion.div key="report" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    <button onClick={() => setSelectedStudentReport(null)} style={{ width: 'fit-content', padding: '12px 25px', backgroundColor: '#3b82f6', color: "white", border: 'none', borderRadius: '15px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                          <ArrowLeft size={20} /> BACK_TO_TERMINAL
                                    </button>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '25px' }}>
                                          <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '40px', border: '2px solid #3b82f6', textAlign: 'center' }}>
                                                <div style={{ width: '100px', height: '100px', borderRadius: '30px', backgroundColor: '#3b82f6', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', fontWeight: '900', color: "white" }}>{selectedStudentReport.name[0]}</div>
                                                <h2 style={{ margin: 0, color: "white", fontWeight: '900' }}>{selectedStudentReport.name}</h2>
                                                <p style={{ color: '#38bdf8', fontWeight: '900', margin: '10px 0' }}>ROLL: {selectedStudentReport.studentId}</p>
                                                <div style={{ textAlign: 'left', marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                      <DetailRow icon={<School size={16} color="#0ea5e9" />} text={selectedStudentReport.college} />
                                                      <DetailRow icon={<Mail size={16} color="#0ea5e9" />} text={selectedStudentReport.email} />
                                                      <DetailRow icon={<Phone size={16} color="#0ea5e9" />} text={selectedStudentReport.phone} />
                                                </div>
                                          </div>
                                          <div style={{ backgroundColor: '#0f172a', padding: '35px', borderRadius: '40px', border: '1px solid #1e293b', gridColumn: 'span 2' }}>
                                                <h3 style={{ textTransform: 'uppercase', color: '#10b981', fontWeight: '900', marginBottom: '35px', display: 'flex', alignItems: 'center', gap: '10px' }}><TrendingUp size={20} /> PERFORMANCE_PULSE</h3>
                                                {reportLoading ? <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" color="#10b981" /></div> : (
                                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                                                            <DataNode label="ATTENDANCE" value={`${reportData.attendance}%`} color="#10b981" />
                                                            <DataNode label="EXAM_AVG" value="NULL" color="#3b82f6" />
                                                            <DataNode label="ASSIGNMENTS" value="0/0" color="#a855f7" />
                                                      </div>
                                                )}
                                          </div>
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  {/* EDIT MODAL */}
                  <AnimatePresence>
                        {editingNode && (
                              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#0f172a', border: '1px solid #3b82f6', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '40px', position: 'relative' }}>
                                          <button onClick={() => setEditingNode(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
                                          <form onSubmit={handleUpdateNode} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                                                <EditInput label="Name" value={editingNode.name} onChange={(v) => setEditingNode({ ...editingNode, name: v })} />
                                                <EditInput label="Roll/ID" value={editingNode.studentId} onChange={(v) => setEditingNode({ ...editingNode, studentId: v })} />
                                                <EditInput label="Email" value={editingNode.email} onChange={(v) => setEditingNode({ ...editingNode, email: v })} />
                                                <EditInput label="Phone" value={editingNode.phone} onChange={(v) => setEditingNode({ ...editingNode, phone: v })} />
                                                <EditInput label="College" value={editingNode.college} onChange={(v) => setEditingNode({ ...editingNode, college: v })} span={2} />
                                                <button type="submit" disabled={updateLoading} style={{ gridColumn: '1 / -1', padding: '16px', backgroundColor: '#0ea5e9', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '900' }}>
                                                      {updateLoading ? "SYNCING..." : "OVERWRITE_DATA"}
                                                </button>
                                          </form>
                                    </motion.div>
                              </div>
                        )}
                  </AnimatePresence>
            </div>
      );
}

// UI COMPONENTS
function TopStationCard({ title, name, id, color, icon }) {
      return (
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '25px', border: `2px solid ${name ? color : '#334155'}`, display: 'flex', alignItems: 'center', gap: '15px', opacity: name ? 1 : 0.6 }}>
                  <div style={{ backgroundColor: name ? color : '#334155', padding: '12px', borderRadius: '15px', color: "white" }}>{icon}</div>
                  <div>
                        <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: '900' }}>{title}</p>
                        <h3 style={{ margin: '2px 0', color: "white", fontWeight: '900', fontSize: '18px' }}>{name || "AWAITING_DATA"}</h3>
                        <p style={{ margin: 0, fontSize: '11px', color: color, fontWeight: '900' }}>{id ? `ID: ${id}` : "SIGNAL_OFF"}</p>
                  </div>
            </div>
      );
}

function StatCard({ label, value, icon, trend, color }) {
      return (
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '25px', borderRadius: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: color }}></div>
                  <div>
                        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', margin: 0, fontWeight: '900' }}>{label}</p>
                        <h4 style={{ fontSize: '32px', fontWeight: '900', margin: '5px 0', color: "white" }}>{value}</h4>
                        <p style={{ fontSize: '10px', color: '#10b981', margin: 0, fontWeight: '900' }}>{trend}</p>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: '#1e293b', borderRadius: '18px' }}>{icon}</div>
            </div>
      );
}

function ProgressBar({ label, value, color }) {
      return (
            <div style={{ width: '100%', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8' }}>{label}</span>
                        <span style={{ fontSize: '12px', fontWeight: '900', color: color }}>{value}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#020617', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: '12px' }}></div>
                  </div>
            </div>
      );
}

function DataNode({ label, value, color }) {
      const numericValue = parseFloat(value) || 0;
      return (
            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '25px', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '10px', fontWeight: '900' }}>{label}</p>
                  <h2 style={{ color: color, margin: '10px 0', fontWeight: '900', fontSize: '24px' }}>{value}</h2>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#020617', borderRadius: '2px' }}>
                        <div style={{ width: `${numericValue}%`, height: '100%', backgroundColor: color, borderRadius: '2px' }}></div>
                  </div>
            </div>
      );
}

function EditInput({ label, value, onChange, span = 1 }) {
      return (
            <div style={{ gridColumn: `span ${span}`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>{label}</label>
                  <input value={value || ""} onChange={(e) => onChange(e.target.value)} style={{ padding: '12px', backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: "white", outline: 'none' }} />
            </div>
      );
}

function DetailRow({ icon, text }) {
      return <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '14px', fontWeight: '700' }}>{icon} {text || "NOT_FOUND"}</div>;
}