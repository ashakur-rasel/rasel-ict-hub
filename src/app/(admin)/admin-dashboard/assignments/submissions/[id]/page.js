"use client";
import { useState, useEffect, use } from "react";
import {
      ArrowLeft, Clock, CheckCircle2, AlertCircle,
      ExternalLink, Save, User, Mail, Hash, Calendar, Loader2, Target, MessageSquare, XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SubmissionView({ params }) {
      const { id } = use(params);
      const [submissions, setSubmissions] = useState([]);
      const [assignment, setAssignment] = useState(null);
      const [loading, setLoading] = useState(true);
      const [toast, setToast] = useState(null);

      const showToast = (msg, type = "success") => {
            setToast({ msg, type });
            setTimeout(() => setToast(null), 3000);
      };

      useEffect(() => {
            const fetchData = async () => {
                  try {
                        const [resSub, resAssign] = await Promise.all([
                              fetch(`/api/submissions?assignmentId=${id}`),
                              fetch(`/api/assignments`)
                        ]);
                        const dataSub = await resSub.json();
                        const dataAssign = await resAssign.json();

                        if (dataSub.success) setSubmissions(dataSub.submissions);
                        if (dataAssign.success) {
                              const current = dataAssign.assignments.find(a => a._id === id);
                              setAssignment(current);
                        }
                  } catch (e) { console.error("Sync error"); }
                  finally { setLoading(false); }
            };
            fetchData();
      }, [id]);

      const handleGrade = async (subId, marks, feedback) => {
            try {
                  const res = await fetch(`/api/submissions`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: subId, marks, feedback })
                  });
                  const data = await res.json();
                  if (data.success) {
                        showToast("GRADE_RECORDED_SUCCESSFULLY ✅", "success");
                        setSubmissions(submissions.map(s => s._id === subId ? { ...s, marks, feedback, status: 'Marked' } : s));
                  }
            } catch (e) { showToast("MARKING_FAILED", "error"); }
      };

      if (loading) return <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0ea5e9', fontWeight: '900', letterSpacing: '2px' }}><Loader2 className="animate-spin" size={40} /> SYNCING_SUBMISSION_NODES...</div>;

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 10px 100px', fontFamily: 'var(--font-rajdhani), sans-serif', backgroundColor: '#fdfdfd' }}>

                  <AnimatePresence>
                        {toast && (
                              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}
                                    style={{ position: 'fixed', top: '30px', right: '30px', zIndex: 10000, backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444", color: 'white', padding: '18px 25px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: '800' }}>
                                    {toast.type === "success" ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                                    {toast.msg}
                              </motion.div>
                        )}
                  </AnimatePresence>

                  <Link href="/admin-dashboard/assignments" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '25px', fontSize: '14px', fontWeight: 'bold' }}>
                        <ArrowLeft size={16} /> BACK_TO_CENTRAL_LOG
                  </Link>

                  <div style={{ backgroundColor: 'white', padding: 'clamp(25px, 4vw, 40px)', borderRadius: '35px', border: '1px solid #e2e8f0', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', color: '#0ea5e9', letterSpacing: '3px' }}>SUBMISSION_TRACKER</p>
                        <h2 style={{ margin: '10px 0', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '900', color: '#0f172a' }}>{assignment?.title}</h2>
                        <div style={{ display: 'flex', gap: '25px', marginTop: '15px', flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#ef4444', fontWeight: '900' }}><Calendar size={16} /> DUE: {new Date(assignment?.deadline).toLocaleString()}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981', fontWeight: '900' }}><Hash size={16} /> TOTAL_ENTRIES: {submissions.length}</span>
                        </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {submissions.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '35px' }}>
                                    <AlertCircle size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                                    <h3 style={{ fontWeight: '900', letterSpacing: '2px' }}>NO_SUBMISSIONS_DETECTED</h3>
                              </div>
                        ) : (
                              submissions.map((sub, index) => {
                                    const isLate = new Date(sub.submittedAt) > new Date(assignment?.deadline);
                                    return (
                                          <div key={sub._id} style={{ backgroundColor: 'white', borderRadius: '35px', border: `1px solid ${isLate ? '#fecaca' : '#e2e8f0'}`, overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>

                                                <div style={{ padding: '25px 35px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', backgroundColor: isLate ? '#fffafb' : '#f8fafc' }}>
                                                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                            <div style={{ width: '50px', height: '50px', backgroundColor: '#f1f5f9', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', fontWeight: '900', border: '1px solid #e2e8f0' }}>{index + 1}</div>
                                                            <div>
                                                                  <h4 style={{ margin: 0, fontWeight: '900', color: '#0f172a', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>{sub.studentName} {isLate && <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '4px 10px', borderRadius: '6px' }}>LATE_SUBMISSION</span>}</h4>
                                                                  <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: '#0ea5e9' }}>{sub.studentEmail}</p>
                                                            </div>
                                                      </div>
                                                      <div style={{ textAlign: 'right' }}>
                                                            <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: '#64748b' }}>TRANSMISSION_TIME:</p>
                                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: isLate ? '#ef4444' : '#10b981' }}>{new Date(sub.submittedAt).toLocaleString()}</p>
                                                      </div>
                                                </div>

                                                <div style={{ padding: '35px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '35px' }}>
                                                      <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><MessageSquare size={16} color="#0ea5e9" /><span style={{ fontSize: '11px', fontWeight: '900', color: '#64748b' }}>STUDENT_RESPONSE:</span></div>
                                                            <div style={{ padding: '25px', color: '#1e293b', backgroundColor: '#f8fafc', borderRadius: '20px', fontSize: '15.5px', lineHeight: '1.8', border: '1px solid #e2e8f0', minHeight: '120px', whiteSpace: 'pre-wrap' }}>{sub.content || "NO_DATA_PROVIDED"}</div>
                                                            {sub.attachment && (
                                                                  <a href={sub.attachment} target="_blank" style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#0ea5e9', textDecoration: 'none', fontSize: '14px', fontWeight: '900', backgroundColor: '#f0f9ff', padding: '12px 25px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                                                                        <ExternalLink size={16} /> VIEW_DRIVE_ASSET
                                                                  </a>
                                                            )}
                                                      </div>

                                                      <div style={{ backgroundColor: '#f8fafc', padding: '30px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Target size={16} color="#10b981" /><span style={{ fontSize: '11px', fontWeight: '900', color: '#10b981' }}>EVALUATION_PROTOCOL:</span></div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                                        <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900' }}>ASSIGN_SCORE</label>
                                                                        <input type="number" placeholder="Marks" defaultValue={sub.marks} id={`marks-${sub._id}`}
                                                                              style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '900', outline: 'none' }} />
                                                                  </div>
                                                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                                        <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '900' }}>FEEDBACK_LOG</label>
                                                                        <textarea placeholder="Type constructive feedback..." defaultValue={sub.feedback} id={`feedback-${sub._id}`}
                                                                              style={{ width: '100%', height: '80px', padding: '15px', backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#1e293b', borderRadius: '12px', outline: 'none', resize: 'none', fontWeight: '600' }} />
                                                                  </div>
                                                                  <button onClick={() => handleGrade(sub._id, document.getElementById(`marks-${sub._id}`).value, document.getElementById(`feedback-${sub._id}`).value)}
                                                                        style={{ width: '100%', padding: '16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '900', boxShadow: '0 5px 15px rgba(16, 185, 129, 0.2)' }}>
                                                                        <Save size={18} /> COMMIT_GRADE
                                                                  </button>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    )
                              })
                        )}
                  </div>
            </div>
      );
}