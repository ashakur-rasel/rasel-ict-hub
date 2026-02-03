"use client";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Save, Loader2, AlertCircle, Trash2, FileText, UserCheck, ChevronLeft, ChevronRight, Eye, BarChart3 } from "lucide-react";
// নিশ্চিত করো স্টেপ ৩ এ বানানো কম্পোনেন্টটি এই পাথে আছে
import AttendanceCharts from "@/components/AttendanceCharts";

export default function AttendanceManager() {
      const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
      const [students, setStudents] = useState([]);
      const [loading, setLoading] = useState(true);
      const [saving, setSaving] = useState(false);
      const [isNewRecord, setIsNewRecord] = useState(true);
      const [toast, setToast] = useState({ type: "", msg: "" });

      // Analytics States
      const [chartData, setChartData] = useState([]);
      const [donutData, setDonutData] = useState([]);

      // History State
      const [history, setHistory] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const recordsPerPage = 10;

      // তারিখ ফরম্যাট করার সলিড ফাংশন (DD-MM-YYYY)
      const formatDateForUI = (dateStr) => {
            if (!dateStr) return "";
            const [y, m, d] = dateStr.split('-');
            return `${d}-${m}-${y}`;
      };

      const displayDate = formatDateForUI(date);

      const showToast = (type, msg) => {
            setToast({ type, msg });
            setTimeout(() => setToast({ type: "", msg: "" }), 4000);
      };

      // স্ট্যাটাস এবং হিস্ট্রি ফেচ করার ফাংশন 
      const fetchAllStatsAndHistory = async () => {
            try {
                  const historyRes = await fetch('/api/attendance/history', { cache: 'no-store' });
                  const historyData = await historyRes.json();
                  if (historyData.success) setHistory(historyData.records || []);

                  const statsRes = await fetch('/api/attendance/stats', { cache: 'no-store' });
                  const statsData = await statsRes.json();
                  if (statsData.success) {
                        setChartData(statsData.chartData);
                        setDonutData(statsData.donutData);
                  }
            } catch (e) { console.error("Stats/History Load Failed"); }
      };

      const fetchAttendanceData = useCallback(async (targetDate) => {
            setLoading(true);
            setStudents([]);
            try {
                  const res = await fetch(`/api/attendance?date=${targetDate}`);
                  const data = await res.json();
                  if (data.success) {
                        if (data.isNew) {
                              setStudents(data.students.map(s => ({ studentId: s._id, name: s.name, status: "Present" })));
                              setIsNewRecord(true);
                        } else {
                              setStudents(data.record.students);
                              setIsNewRecord(false);
                        }
                  }
            } catch (e) {
                  showToast("error", "Network error: Could not load students.");
            } finally {
                  setLoading(false);
            }
      }, []);

      useEffect(() => {
            fetchAttendanceData(date);
            fetchAllStatsAndHistory();
      }, [date, fetchAttendanceData]);

      const handleViewRecord = async (selectedDate) => {
            if (selectedDate === date) {
                  await fetchAttendanceData(selectedDate);
            } else {
                  setDate(selectedDate);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast("success", `Loading Record: ${formatDateForUI(selectedDate)}`);
      };

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
                        showToast("success", `Attendance Synced for ${displayDate} ✅`);
                        setIsNewRecord(false);
                        fetchAllStatsAndHistory(); // চার্ট এবং হিস্ট্রি আপডেট
                  }
            } catch (e) { showToast("error", "Server Timeout."); }
            finally { setSaving(false); }
      };

      const deleteDayData = async (targetDate) => {
            const dateToDelete = targetDate || date;
            if (!confirm("Erase all data for " + formatDateForUI(dateToDelete) + "?")) return;
            try {
                  const res = await fetch(`/api/attendance?date=${dateToDelete}`, { method: 'DELETE' });
                  if (res.ok) {
                        showToast("success", "Records Cleared.");
                        if (dateToDelete === date) fetchAttendanceData(date);
                        fetchAllStatsAndHistory();
                  }
            } catch (e) { showToast("error", "Failed to delete."); }
      };

      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = history.slice(indexOfFirstRecord, indexOfLastRecord);
      const totalPages = Math.ceil(history.length / recordsPerPage);

      return (
            <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', padding: 'clamp(10px, 3vw, 20px)', backgroundColor: '#f8fafc', minHeight: '100vh' }}>

                  {/* Toast Notification */}
                  {toast.msg && (
                        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, padding: '15px 25px', borderRadius: '12px', backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444", color: 'white', fontWeight: 'bold', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
                              {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />} {toast.msg}
                        </div>
                  )}

                  {/* Analytics Section - Bar & Donut Charts */}
                  <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <BarChart3 size={24} color="#0ea5e9" /> ATTENDANCE_ANALYTICS
                        </h2>
                        {chartData.length > 0 ? (
                              <AttendanceCharts data={chartData} donutData={donutData} />
                        ) : (
                              <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    No enough data yet to generate visual analytics.
                              </div>
                        )}
                  </div>

                  {/* Responsive Stats Header  */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '15px', marginBottom: '25px' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '20px', color: 'white' }}>
                              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', display: 'block', marginBottom: '10px' }}>SESSION_DATE: {displayDate}</label>
                              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontWeight: 'bold', fontSize: '16px', outline: 'none' }} />
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                              <div style={{ textAlign: 'center' }}><p style={{ fontSize: '11px', color: '#64748b' }}>PRESENT</p><h3 style={{ color: '#10b981', margin: 0, fontSize: '24px', fontWeight: '900' }}>{students.filter(s => s.status === "Present").length}</h3></div>
                              <div style={{ textAlign: 'center' }}><p style={{ fontSize: '11px', color: '#64748b' }}>ABSENT</p><h3 style={{ color: '#ef4444', margin: 0, fontSize: '24px', fontWeight: '900' }}>{students.filter(s => s.status === "Absent").length}</h3></div>
                        </div>
                  </div>

                  {/* Editor Box */}
                  <div id="editor-box" style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: 'clamp(15px, 4vw, 25px)', marginBottom: '40px' }}>
                        <div style={{ marginBottom: '20px', padding: '10px 15px', borderRadius: '12px', backgroundColor: isNewRecord ? '#fffbeb' : '#f0fdf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                              <span style={{ fontWeight: 'bold', fontSize: '13px', color: isNewRecord ? '#b45309' : '#166534' }}>{isNewRecord ? "● NEW ENTRY MODE" : "● EDITING STORED RECORD"}</span>
                              {!isNewRecord && <button onClick={() => deleteDayData(date)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><Trash2 size={18} /> <span style={{ fontSize: '12px', fontWeight: 'bold' }}>DELETE</span></button>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '12px' }}>
                              {loading ? <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}><Loader2 className="animate-spin" size={30} /></div> :
                                    students.map(s => (
                                          <div key={s.studentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #f1f5f9', borderRadius: '15px', backgroundColor: s.status === "Present" ? "#f0fdf4" : "#fff1f2" }}>
                                                <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px', marginRight: '10px' }}>{s.name}</span>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                      <button onClick={() => toggleStatus(s.studentId, "Present")} style={{ backgroundColor: s.status === "Present" ? "#10b981" : "#f1f5f9", color: s.status === "Present" ? "white" : "#64748b", border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>P</button>
                                                      <button onClick={() => toggleStatus(s.studentId, "Absent")} style={{ backgroundColor: s.status === "Absent" ? "#ef4444" : "#f1f5f9", color: s.status === "Absent" ? "white" : "#64748b", border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>A</button>
                                                </div>
                                          </div>
                                    ))}
                        </div>
                        <button onClick={saveAttendance} style={{ width: '100%', marginTop: '25px', padding: '18px', backgroundColor: '#0f172a', color: 'white', borderRadius: '18px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                              {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                              {isNewRecord ? "SUBMIT_ATTENDANCE" : "UPDATE_ATTENDANCE"}
                        </button>
                  </div>

                  {/* History Table - Responsive View  */}
                  <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', backgroundColor: '#0f172a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3 style={{ margin: 0, fontSize: 'clamp(14px, 4vw, 16px)', fontWeight: 'bold' }}>ATTENDANCE_HISTORY_LOG</h3>
                              <span style={{ fontSize: '11px', fontWeight: 'bold', opacity: 0.8 }}>Records: {history.length}</span>
                        </div>
                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '550px' }}>
                                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                          <tr>
                                                <th style={{ padding: '15px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>SESSION DATE</th>
                                                <th style={{ padding: '15px', textAlign: 'center', fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>STATISTICS</th>
                                                <th style={{ padding: '15px', textAlign: 'right', fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>ACTIONS</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {currentRecords.map((rec) => (
                                                <tr key={rec.date} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                      <td style={{ padding: '15px', fontWeight: 'bold', color: '#1e293b', fontSize: '14px' }}>{formatDateForUI(rec.date)}</td>
                                                      <td style={{ padding: '15px', textAlign: 'center' }}>
                                                            <span style={{ color: '#10b981', fontWeight: 'bold', marginRight: '10px', fontSize: '13px' }}>P: {rec.students.filter(s => s.status === "Present").length}</span>
                                                            <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '13px' }}>A: {rec.students.filter(s => s.status === "Absent").length}</span>
                                                      </td>
                                                      <td style={{ padding: '15px', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                                  <button onClick={() => handleViewRecord(rec.date)} style={{ background: '#f0f9ff', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Eye size={18} color="#0ea5e9" /></button>
                                                                  <button onClick={() => deleteDayData(rec.date)} style={{ background: '#fef2f2', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={18} color="#ef4444" /></button>
                                                            </div>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>

                        {/* Pagination - Responsive Layout */}
                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', backgroundColor: '#f8fafc', flexWrap: 'wrap' }}>
                              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ cursor: 'pointer', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', padding: '8px' }}><ChevronLeft size={20} /></button>
                              <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#475569' }}>PAGE {currentPage} OF {totalPages || 1}</span>
                              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} style={{ cursor: 'pointer', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', padding: '8px' }}><ChevronRight size={20} /></button>
                        </div>
                  </div>

                  <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
            </div>
      );
}