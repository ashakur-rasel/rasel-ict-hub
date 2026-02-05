"use client";
import { useState, useEffect, useCallback } from "react";
import {
      CheckCircle, Save, Loader2, AlertCircle, Trash2, FileText,
      UserCheck, ChevronLeft, ChevronRight, Eye, BarChart3,
      Calendar as CalendarIcon, XCircle, ShieldAlert
} from "lucide-react";
import AttendanceCharts from "@/components/AttendanceCharts";

export default function AttendanceManager() {
      const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
      const [students, setStudents] = useState([]);
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const [isNewRecord, setIsNewRecord] = useState(true);
      const [toast, setToast] = useState({ type: "", msg: "" });
      const [confirmDelete, setConfirmDelete] = useState(null);

      const [chartData, setChartData] = useState([]);
      const [donutData, setDonutData] = useState([]);
      const [history, setHistory] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const recordsPerPage = 10;

      const formatDateForUI = (dateStr) => {
            if (!dateStr) return "";
            const [y, m, d] = dateStr.split('-');
            return `${d}-${m}-${y}`;
      };

      const showToast = (type, msg) => {
            setToast({ type, msg });
            setTimeout(() => setToast({ type: "", msg: "" }), 4000);
      };

      const fetchAnalyticsAndHistory = async () => {
            try {
                  const [histRes, statsRes] = await Promise.all([
                        fetch('/api/attendance/history', { cache: 'no-store' }),
                        fetch('/api/attendance/stats', { cache: 'no-store' })
                  ]);
                  const histData = await histRes.json();
                  const statsData = await statsRes.json();

                  if (histData.success) setHistory(histData.records || []);
                  if (statsData.success) {
                        setChartData(statsData.chartData || []);
                        setDonutData(statsData.donutData || []);
                  }
            } catch (e) { console.error("SIGNAL_SYNC_FAILED"); }
      };

      const fetchAttendanceData = useCallback(async (targetDate) => {
            setLoading(true);
            try {
                  const res = await fetch(`/api/attendance?date=${targetDate}`);
                  const data = await res.json();
                  if (data.success) {
                        if (data.isNew) {
                              setStudents(data.students.map(s => ({ studentId: s._id, name: s.name, roll: s.studentId, status: "Present" })));
                              setIsNewRecord(true);
                        } else {
                              setStudents(data.record.students);
                              setIsNewRecord(false);
                        }
                  }
            } catch (e) { showToast("error", "DATABASE_LINK_ERROR"); }
            finally { setLoading(false); }
      }, []);

      // ফিক্সড: এই ফাংশনটি আগে মিসিং ছিল
      const handleViewRecord = async (selectedDate) => {
            if (selectedDate === date) {
                  await fetchAttendanceData(selectedDate);
            } else {
                  setDate(selectedDate);
            }
            window.scrollTo({ top: 300, behavior: 'smooth' }); // এডিটর বক্সে স্ক্রল করবে
            showToast("success", `SYNCING_RECORD: ${formatDateForUI(selectedDate)}`);
      };

      useEffect(() => {
            fetchAttendanceData(date);
            fetchAnalyticsAndHistory();
      }, [date, fetchAttendanceData]);

      const toggleStatus = (id, newStatus) => {
            setStudents(prev => prev.map(s => s.studentId === id ? { ...s, status: newStatus } : s));
      };

      const saveAttendance = async () => {
            setSaving(true);
            try {
                  const res = await fetch('/api/attendance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ date, students })
                  });
                  const data = await res.json();
                  if (data.success) {
                        showToast("success", `COMMITTED_FOR_${formatDateForUI(date)}`);
                        setIsNewRecord(false);
                        fetchAnalyticsAndHistory();
                  }
            } catch (e) { showToast("error", "TRANSMISSION_FAILED"); }
            finally { setSaving(false); }
      };

      const deleteRecord = async () => {
            if (!confirmDelete) return;
            try {
                  const res = await fetch(`/api/attendance?date=${confirmDelete}`, { method: 'DELETE' });
                  if (res.ok) {
                        showToast("success", "RECORD_PURGED");
                        if (confirmDelete === date) fetchAttendanceData(date);
                        fetchAnalyticsAndHistory();
                  }
            } catch (e) { showToast("error", "PURGE_FAILED"); }
            finally { setConfirmDelete(null); }
      };

      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = history.slice(indexOfFirstRecord, indexOfLastRecord);
      const totalPages = Math.ceil(history.length / recordsPerPage);

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', padding: 'clamp(10px, 3vw, 20px)', paddingBottom: '100px', color: '#f8fafc' }}>

                  {toast.msg && (
                        <div style={{ position: 'fixed', top: '30px', right: '30px', zIndex: 10000, padding: '18px 25px', borderRadius: '15px', backgroundColor: toast.type === "success" ? "#10b981" : "#f43f5e", color: 'white', fontWeight: '900', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'flex', gap: '12px', alignItems: 'center', animation: 'slideIn 0.3s ease-out' }}>
                              {toast.type === "success" ? <CheckCircle size={22} /> : <AlertCircle size={22} />} {toast.msg}
                        </div>
                  )}

                  {confirmDelete && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                              <div style={{ backgroundColor: '#0f172a', border: '2px solid #f43f5e', padding: '40px', borderRadius: '35px', maxWidth: '450px', textAlign: 'center' }}>
                                    <ShieldAlert size={60} color="#f43f5e" style={{ marginBottom: '20px' }} />
                                    <h3 style={{ color: 'white', fontWeight: '900', margin: '0 0 10px 0' }}>CONFIRM_PURGE</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>Erase record for {formatDateForUI(confirmDelete)}?</p>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                          <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #1e293b', background: 'none', color: 'white', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
                                          <button onClick={deleteRecord} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#f43f5e', color: 'white', fontWeight: '900', cursor: 'pointer' }}>DELETE</button>
                                    </div>
                              </div>
                        </div>
                  )}

                  <div style={{ marginBottom: '40px', backgroundColor: '#0f172a', padding: '30px', borderRadius: '35px', border: '1px solid #1e293b' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '900', color: '#0ea5e9', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <BarChart3 size={24} /> VISUAL_ANALYTICS
                        </h2>
                        {chartData.length > 0 ? <AttendanceCharts data={chartData} donutData={donutData} /> : <div style={{ padding: '60px', textAlign: 'center', color: '#475569' }}>DATA_FEED_NULL</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '25px', border: '1px solid #1e293b' }}>
                              <label style={{ fontSize: '11px', fontWeight: '900', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}><CalendarIcon size={16} /> SESSION_DATE</label>
                              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#020617', color: 'white', fontWeight: '900', fontSize: '16px', outline: 'none', border: '1px solid #1e293b' }} />
                        </div>
                        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '25px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', border: '1px solid #334155' }}>
                              <div style={{ textAlign: 'center' }}><p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900' }}>PRESENT</p><h3 style={{ color: '#10b981', margin: 0, fontSize: '32px', fontWeight: '900' }}>{students.filter(s => s.status === "Present").length}</h3></div>
                              <div style={{ textAlign: 'center' }}><p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900' }}>ABSENT</p><h3 style={{ color: '#f43f5e', margin: 0, fontSize: '32px', fontWeight: '900' }}>{students.filter(s => s.status === "Absent").length}</h3></div>
                        </div>
                  </div>

                  <div style={{ backgroundColor: '#0f172a', borderRadius: '35px', border: '1px solid #1e293b', padding: 'clamp(20px, 4vw, 35px)', marginBottom: '50px' }}>
                        <div style={{ marginBottom: '25px', padding: '12px 20px', borderRadius: '15px', backgroundColor: isNewRecord ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${isNewRecord ? '#f59e0b' : '#10b981'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '900', fontSize: '12px', color: isNewRecord ? '#f59e0b' : '#10b981' }}>{isNewRecord ? "● NEW_ENTRY" : "● EDIT_MODE"}</span>
                              {!isNewRecord && <button onClick={() => setConfirmDelete(date)} style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '900', fontSize: '11px' }}>ERASE_DATE</button>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '15px' }}>
                              {loading ? <div style={{ gridColumn: '1/-1', textAlign: 'center' }}><Loader2 className="animate-spin" color="#0ea5e9" /></div> :
                                    students.map(s => (
                                          <div key={s.studentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px', border: '1px solid #1e293b', borderRadius: '20px', backgroundColor: s.status === "Present" ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)' }}>
                                                <div>
                                                      <span style={{ fontWeight: '900', color: 'white', fontSize: '15px', display: 'block' }}>{s.name}</span>
                                                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '800' }}>ROLL: {s.roll || "000"}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                      <button onClick={() => toggleStatus(s.studentId, "Present")} style={{ backgroundColor: s.status === "Present" ? "#10b981" : "#020617", color: s.status === "Present" ? "#020617" : "#475569", border: '1px solid #1e293b', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '900' }}>P</button>
                                                      <button onClick={() => toggleStatus(s.studentId, "Absent")} style={{ backgroundColor: s.status === "Absent" ? "#f43f5e" : "#020617", color: s.status === "Absent" ? "#020617" : "#475569", border: '1px solid #1e293b', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '900' }}>A</button>
                                                </div>
                                          </div>
                                    ))
                              }
                        </div>

                        <button onClick={saveAttendance} disabled={saving} style={{ width: '100%', marginTop: '35px', padding: '20px', backgroundColor: '#0ea5e9', color: '#020617', borderRadius: '18px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', border: 'none' }}>
                              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />} {isNewRecord ? "SUBMIT_DATA" : "UPDATE_RECORD"}
                        </button>
                  </div>

                  {/* HISTORY TABLE */}
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '35px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                        <div style={{ padding: '25px 30px', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: 'white' }}>ARCHIVE_LOG_INDEX</h3>
                              <span style={{ fontSize: '11px', color: '#0ea5e9', fontWeight: '900' }}>TOTAL_ENTRIES: {history.length}</span>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                    <thead>
                                          <tr style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>
                                                <th style={{ padding: '20px 30px' }}>Date</th>
                                                <th style={{ padding: '20px', textAlign: 'center' }}>Stats</th>
                                                <th style={{ padding: '20px 30px', textAlign: 'right' }}>Command</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {currentRecords.map((rec) => (
                                                <tr key={rec.date} style={{ borderBottom: '1px solid #1e293b' }}>
                                                      <td style={{ padding: '20px 30px', fontWeight: '900', color: '#38bdf8' }}>{formatDateForUI(rec.date)}</td>
                                                      <td style={{ padding: '20px', textAlign: 'center' }}>
                                                            <span style={{ color: '#10b981', fontWeight: '900', marginRight: '15px' }}>P: {rec.students.filter(s => s.status === "Present").length}</span>
                                                            <span style={{ color: '#f43f5e', fontWeight: '900' }}>A: {rec.students.filter(s => s.status === "Absent").length}</span>
                                                      </td>
                                                      <td style={{ padding: '20px 30px', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                                                                  {/* handleViewRecord এখন ডিফাইনড */}
                                                                  <button onClick={() => handleViewRecord(rec.date)} style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid #0ea5e9', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}><Eye size={18} color="#0ea5e9" /></button>
                                                                  <button onClick={() => setConfirmDelete(rec.date)} style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', padding: '8px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={18} color="#f43f5e" /></button>
                                                            </div>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>
            </div>
      );
}