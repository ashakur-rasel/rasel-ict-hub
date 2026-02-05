"use client";
import { useState, useEffect } from "react";
import {
      Clock, Calendar, ArrowLeft, Award, CheckCircle2, XCircle, FileText,
      AlertCircle, ChevronRight, Loader2, Target, User, ShieldAlert
} from "lucide-react";

export default function ExamHistory() {
      const [exams, setExams] = useState([]);
      const [selectedExam, setSelectedExam] = useState(null);
      const [results, setResults] = useState([]);
      const [loading, setLoading] = useState(true);
      const [selectedResult, setSelectedResult] = useState(null);

      useEffect(() => {
            fetch('/api/exams').then(res => res.json()).then(data => {
                  if (data.success) setExams(data.exams);
                  setLoading(false);
            });
      }, []);

      const viewResults = async (exam) => {
            setSelectedExam(exam);
            setLoading(true);
            try {
                  const res = await fetch(`/api/results?examId=${exam._id}`);
                  const data = await res.json();
                  if (data.success) setResults(data.results);
            } catch (error) { console.error("Sync error"); }
            setLoading(false);
      };

      if (loading) return <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#38bdf8', fontWeight: '900', letterSpacing: '2px' }}><Loader2 className="animate-spin" size={40} /> SYNCING_MASTER_LOGS...</div>;

      return (
            <div style={{ padding: 'clamp(10px, 3vw, 20px)', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', color: '#f8fafc' }}>

                  {/* DYNAMIC HEADER */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', backgroundColor: '#0f172a', padding: '25px', borderRadius: '30px', border: '1px solid #1e293b', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                              <h2 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '900', margin: 0, color: '#38bdf8' }}>
                                    {selectedExam ? (selectedResult ? "ANSWER_SCRIPT_PROTOCOL" : "SCOREBOARD_OVERVIEW") : "ARCHIVED_EXAM_STATIONS"}
                              </h2>
                              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '900', letterSpacing: '2px', margin: '5px 0 0 0' }}>MASTER_DATABASE_STORAGE</p>
                        </div>
                        {selectedExam && (
                              <button onClick={() => selectedResult ? setSelectedResult(null) : setSelectedExam(null)} style={{ padding: '12px 25px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '15px', cursor: 'pointer', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <ArrowLeft size={18} color="#0ea5e9" /> RETURN
                              </button>
                        )}
                  </div>

                  {!selectedExam ? (
                        /* --- Exam Station List --- */
                        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))' }}>
                              {exams.map((exam) => (
                                    <div key={exam._id} style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '35px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                          <div>
                                                <h3 style={{ margin: '0 0 10px 0', color: 'white', fontWeight: '900', fontSize: '20px' }}>{exam.title.toUpperCase()}</h3>
                                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: '700' }}><Calendar size={16} color="#0ea5e9" /> {new Date(exam.date).toLocaleDateString()}</span>
                                                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px', fontWeight: '700' }}><Clock size={16} color="#0ea5e9" /> {exam.startTime}</span>
                                                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px', fontWeight: '900' }}><Award size={16} /> {exam.questions.length} MARKS</span>
                                                </div>
                                          </div>
                                          <button onClick={() => viewResults(exam)} style={{ backgroundColor: '#0ea5e9', color: '#020617', padding: '14px 25px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                                                ACCESS_RESULTS <ChevronRight size={18} />
                                          </button>
                                    </div>
                              ))}
                        </div>
                  ) : selectedResult ? (
                        /* --- Script Viewer --- */
                        <div style={{ backgroundColor: '#0f172a', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '35px', border: '1px solid #0ea5e9' }}>
                              <div style={{ marginBottom: '35px', borderBottom: '2px dashed #1e293b', paddingBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                                    <div>
                                          <h3 style={{ fontWeight: '900', color: 'white', margin: 0, fontSize: '24px' }}>{selectedResult.studentName}</h3>
                                          <p style={{ color: '#38bdf8', fontWeight: '900', margin: '5px 0' }}>NODE_ID: {selectedResult.studentId}</p>
                                    </div>
                                    <div style={{ backgroundColor: '#020617', padding: '15px 30px', borderRadius: '20px', border: '1px solid #1e293b', textAlign: 'center' }}>
                                          <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: '900' }}>TOTAL_SCORE</p>
                                          <h3 style={{ margin: 0, color: '#10b981', fontSize: '32px', fontWeight: '900' }}>{selectedResult.score} / {selectedResult.totalQuestions}</h3>
                                    </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    {selectedExam.questions.map((q, idx) => {
                                          const studentAns = selectedResult.answers.find(a => a.questionId === q._id);
                                          const isCorrect = studentAns?.selectedOption === q.correctAnswer;
                                          return (
                                                <div key={idx} style={{ padding: '25px', backgroundColor: '#020617', borderRadius: '25px', border: `1px solid ${studentAns ? (isCorrect ? '#10b981' : '#f43f5e') : '#1e293b'}` }}>
                                                      <p style={{ fontWeight: '900', color: 'white', marginBottom: '20px' }}><span style={{ color: '#0ea5e9' }}>MODULE_{idx + 1}:</span> {q.questionText}</p>
                                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                                                            {['a', 'b', 'c', 'd'].map(opt => {
                                                                  const isThisCorrect = q.correctAnswer === opt;
                                                                  const isThisSelected = studentAns?.selectedOption === opt;
                                                                  return (
                                                                        <div key={opt} style={{ padding: '15px', borderRadius: '14px', border: '1px solid #1e293b', backgroundColor: isThisSelected ? (isThisCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)') : '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                              <span style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: isThisCorrect ? '#10b981' : (isThisSelected ? '#f43f5e' : '#1e293b'), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' }}>{opt.toUpperCase()}</span>
                                                                              <span style={{ color: isThisCorrect ? '#10b981' : (isThisSelected ? '#f43f5e' : '#94a3b8'), fontWeight: '700' }}>{q.options[opt]}</span>
                                                                              {isThisSelected && <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: '900' }}>{isThisCorrect ? 'VALID' : 'INVALID'}</span>}
                                                                        </div>
                                                                  );
                                                            })}
                                                      </div>
                                                </div>
                                          );
                                    })}
                              </div>
                        </div>
                  ) : (
                        /* --- Scoreboard Table --- */
                        <div style={{ backgroundColor: '#0f172a', borderRadius: '35px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                              <div style={{ padding: '25px 30px', backgroundColor: '#1e293b', color: '#38bdf8', fontWeight: '900', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>EXAM_SCOREBOARD_PROTOCOL</span>
                                    <div style={{ backgroundColor: '#0ea5e9', color: '#020617', padding: '4px 12px', borderRadius: '8px', fontSize: '11px' }}>CANDIDATES: {results.length}</div>
                              </div>
                              <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                                          <thead>
                                                <tr style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>
                                                      <th style={{ padding: '25px' }}>Identity_Node</th>
                                                      <th style={{ padding: '25px' }}>Score_Result</th>
                                                      <th style={{ padding: '25px' }}>Success_Rate</th>
                                                      <th style={{ padding: '25px', textAlign: 'right' }}>Command</th>
                                                </tr>
                                          </thead>
                                          <tbody style={{ color: '#cbd5e1' }}>
                                                {results.map((res) => {
                                                      const percent = (res.score / res.totalQuestions) * 100;
                                                      return (
                                                            <tr key={res._id} style={{ borderBottom: '1px solid #1e293b' }}>
                                                                  <td style={{ padding: '20px 25px' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                              <div style={{ width: '35px', height: '35px', borderRadius: '10px', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>{res.studentName[0]}</div>
                                                                              <span style={{ fontWeight: '800', color: 'white' }}>{res.studentName}</span>
                                                                        </div>
                                                                  </td>
                                                                  <td style={{ padding: '20px 25px', fontWeight: '900', color: '#10b981' }}>{res.score} / {res.totalQuestions}</td>
                                                                  <td style={{ padding: '20px 25px' }}>
                                                                        <div style={{ width: '100px', height: '6px', backgroundColor: '#020617', borderRadius: '10px', overflow: 'hidden' }}>
                                                                              <div style={{ width: `${percent}%`, height: '100%', backgroundColor: percent >= 40 ? '#10b981' : '#f43f5e' }}></div>
                                                                        </div>
                                                                        <span style={{ fontSize: '10px', fontWeight: '900', marginTop: '5px', display: 'block' }}>{percent.toFixed(1)}%</span>
                                                                  </td>
                                                                  <td style={{ padding: '20px 25px', textAlign: 'right' }}>
                                                                        <button onClick={() => setSelectedResult(res)} style={{ background: 'transparent', border: '1px solid #38bdf8', color: '#38bdf8', padding: '8px 18px', borderRadius: '12px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}>VIEW_SCRIPT</button>
                                                                  </td>
                                                            </tr>
                                                      );
                                                })}
                                          </tbody>
                                    </table>
                              </div>
                        </div>
                  )}

                  <style jsx global>{`
                        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                        ::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
                  `}</style>
            </div>
      );
}