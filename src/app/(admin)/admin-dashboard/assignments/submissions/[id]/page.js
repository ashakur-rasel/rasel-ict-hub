"use client";
import { useState, useEffect, use } from "react";
import {
      ArrowLeft, Clock, CheckCircle, AlertCircle,
      ExternalLink, Save, User, Mail, Hash, Calendar
} from "lucide-react";
import Link from "next/link";

export default function SubmissionView({ params }) {
      const { id } = use(params); // Assignment ID ক্যাচ করা
      const [submissions, setSubmissions] = useState([]);
      const [assignment, setAssignment] = useState(null);
      const [loading, setLoading] = useState(true);
      const [toast, setToast] = useState(null);

      const showToast = (msg) => {
            setToast(msg);
            setTimeout(() => setToast(null), 3000);
      };

      useEffect(() => {
            // ১. অ্যাসাইনমেন্ট ডিটেইলস এবং সাবমিশন ফেচ করা
            const fetchData = async () => {
                  const [resSub, resAssign] = await Promise.all([
                        fetch(`/api/submissions?assignmentId=${id}`),
                        fetch(`/api/assignments`) // সব এনে আইডি দিয়ে ফিল্টার করছি
                  ]);
                  const dataSub = await resSub.json();
                  const dataAssign = await resAssign.json();

                  if (dataSub.success) setSubmissions(dataSub.submissions);
                  if (dataAssign.success) {
                        const current = dataAssign.assignments.find(a => a._id === id);
                        setAssignment(current);
                  }
                  setLoading(false);
            };
            fetchData();
      }, [id]);

      // ২. গ্রেডিং আপডেট লজিক
      const handleGrade = async (subId, marks, feedback) => {
            const res = await fetch(`/api/submissions`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: subId, marks, feedback })
            });
            const data = await res.json();
            if (data.success) {
                  showToast("Marks Updated! ✅");
                  setSubmissions(submissions.map(s => s._id === subId ? { ...s, marks, feedback, status: 'Marked' } : s));
            }
      };

      if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontWeight: 'bold' }}>SYNCING_RECORDS...</div>;

      return (
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '15px', paddingBottom: '100px', fontFamily: 'var(--font-rajdhani), sans-serif' }}>

                  {toast && (
                        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#0f172a', color: 'white', padding: '12px 20px', borderRadius: '10px', zIndex: 9999, borderLeft: '4px solid #10b981' }}>{toast}</div>
                  )}

                  {/* Back & Header */}
                  <Link href="/admin-dashboard/assignments" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', textDecoration: 'none', marginBottom: '20px', fontSize: '14px' }}>
                        <ArrowLeft size={16} /> BACK_TO_HISTORY
                  </Link>

                  <div style={{ backgroundColor: '#0ea5e9', padding: '30px', borderRadius: '24px', color: 'white', marginBottom: '30px' }}>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', opacity: 0.8 }}>SUBMISSION_TRACKER</p>
                        <h2 style={{ margin: '5px 0', fontSize: '28px', fontWeight: '900' }}>{assignment?.title}</h2>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '13px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> Due: {new Date(assignment?.deadline).toLocaleString()}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Hash size={14} /> Total: {submissions.length}</span>
                        </div>
                  </div>

                  {/* Submissions List */}
                  <div style={{ display: 'grid', gap: '20px' }}>
                        {submissions.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '20px' }}>No submissions yet.</div>
                        ) : (
                              submissions.map((sub, index) => {
                                    const isLate = new Date(sub.submittedAt) > new Date(assignment?.deadline);
                                    return (
                                          <div key={sub._id} style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                                {/* Student Info Header */}
                                                <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', backgroundColor: isLate ? '#fffafb' : 'white' }}>
                                                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                            <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', fontWeight: 'bold' }}>{index + 1}</div>
                                                            <div>
                                                                  <h4 style={{ margin: 0, fontWeight: 'bold', color: '#a34111', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>{sub.studentName} {isLate && <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', padding: '2px 8px', borderRadius: '5px' }}>LATE_SUBMISSION</span>}</h4>
                                                                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#0864e5' }}>{sub.studentEmail}</p>
                                                            </div>
                                                      </div>
                                                      <div style={{ textAlign: 'right', fontSize: '12px' }}>
                                                            <p style={{ margin: 0, fontWeight: 'bold', color: '#64748b' }}>Submitted At:</p>
                                                            <p style={{ margin: 0, fontWeight: 'bold', color: isLate ? '#ef4444' : '#10b981' }}>{new Date(sub.submittedAt).toLocaleString()}</p>
                                                      </div>
                                                </div>

                                                {/* Content Section */}
                                                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                                                      <div>
                                                            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#0ea5e9', marginBottom: '8px' }}>STUDENT_RESPONSE:</p>
                                                            <div style={{ padding: '15px', color: '#18181a', backgroundColor: '#f8fafc', borderRadius: '12px', fontSize: '14px', whiteSpace: 'pre-wrap', border: '1px solid #051325', minHeight: '80px' }}>{sub.content || "No text content provided."}</div>
                                                            {sub.attachment && (
                                                                  <a href={sub.attachment} target="_blank" style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#03161f', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                                                                        <ExternalLink size={14} /> VIEW_DRIVE_ATTACHMENT
                                                                  </a>
                                                            )}
                                                      </div>

                                                      {/* Grading Section */}
                                                      <div style={{ backgroundColor: '#fdfdfd', padding: '15px', borderRadius: '15px', border: '1px solid #000000' }}>
                                                            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>TEACHER_FEEDBACK & MARKS:</p>
                                                            <div style={{ display: 'flex', color: '#18181a', gap: '10px', marginBottom: '10px' }}>
                                                                  <input
                                                                        type="number" placeholder="Marks"
                                                                        defaultValue={sub.marks}
                                                                        id={`marks-${sub._id}`}
                                                                        style={{ width: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #383a3b', outline: 'none' }}
                                                                  />
                                                                  <input
                                                                        type="text" placeholder="Comment (e.g. Good job!)"
                                                                        defaultValue={sub.feedback}
                                                                        id={`feedback-${sub._id}`}
                                                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #474d56', outline: 'none' }}
                                                                  />
                                                            </div>
                                                            <button
                                                                  onClick={() => {
                                                                        const m = document.getElementById(`marks-${sub._id}`).value;
                                                                        const f = document.getElementById(`feedback-${sub._id}`).value;
                                                                        handleGrade(sub._id, m, f);
                                                                  }}
                                                                  style={{ width: '100%', padding: '10px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}
                                                            >
                                                                  <Save size={16} /> SAVE_GRADE
                                                            </button>
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