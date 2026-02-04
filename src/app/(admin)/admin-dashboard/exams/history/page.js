"use client";
import { useState, useEffect } from "react";
import {
      Clock, Calendar, Users, ChevronRight,
      ArrowLeft, Award, CheckCircle2, XCircle, FileText, AlertCircle // <--- এখানে AlertCircle যোগ করো
} from "lucide-react";

export default function ExamHistory() {
      const [exams, setExams] = useState([]);
      const [selectedExam, setSelectedExam] = useState(null);
      const [results, setResults] = useState([]);
      const [loading, setLoading] = useState(true);
      const [selectedResult, setSelectedResult] = useState(null); // স্ক্রিপ্ট দেখার জন্য

      // ১. সব এক্সাম হিস্ট্রি লোড করা
      useEffect(() => {
            fetch('/api/exams')
                  .then(res => res.json())
                  .then(data => {
                        if (data.success) setExams(data.exams);
                        setLoading(false);
                  });
      }, []);

      // ২. নির্দিষ্ট এক্সামের রেজাল্ট ফেচ করা
      const viewResults = async (exam) => {
            setSelectedExam(exam);
            setLoading(true);
            try {
                  const res = await fetch(`/api/results?examId=${exam._id}`);
                  const data = await res.json();
                  if (data.success) {
                        setResults(data.results);
                  }
            } catch (error) {
                  console.error("Failed to fetch results");
            }
            setLoading(false);
      };

      if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontWeight: '900' }}>SYNCING_EXAM_RECORDS...</div>;

      return (
            <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif' }}>

                  {/* Header */}
                  <div style={{ display: 'flex', backgroundColor: '#a5d7fa', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '15px 20px', borderRadius: '15px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#3169ec' }}>
                              {selectedExam ? (selectedResult ? "STUDENT_ANSWER_SCRIPT" : "STUDENT_SCOREBOARD") : "EXAM_HISTORY_LOG"}
                        </h2>
                        {selectedExam && (
                              <button
                                    onClick={() => selectedResult ? setSelectedResult(null) : setSelectedExam(null)}
                                    style={{ padding: '10px 20px', backgroundColor: '#153abf', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}
                              >
                                    <ArrowLeft size={18} /> BACK
                              </button>
                        )}
                  </div>

                  {!selectedExam ? (
                        /* --- Exam List View --- */
                        <div style={{ display: 'grid', gap: '15px' }}>
                              {exams.map((exam) => (
                                    <div key={exam._id} style={{ backgroundColor: '#c1dafe', padding: '20px', borderRadius: '20px', border: '1px solid #fdaefc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                          <div>
                                                <h3 style={{ margin: '0 0 5px 0', color: '#0e0ee9', fontWeight: '900' }}>{exam.title.toUpperCase()}</h3>
                                                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#029da2', fontWeight: '600' }}>
                                                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(exam.date).toLocaleDateString()}</span>
                                                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {exam.startTime}</span>
                                                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Award size={14} /> {exam.questions.length} Marks</span>
                                                </div>
                                          </div>
                                          <button onClick={() => viewResults(exam)} style={{ backgroundColor: '#08b327', color: 'white', padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                VIEW_RESULTS <ChevronRight size={18} />
                                          </button>
                                    </div>
                              ))}
                        </div>
                  ) : selectedResult ? (
                        /* --- View Script View (The detail of student answers) --- */
                        <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '20px', border: '3px solid #0ea5e9' }}>
                              <div style={{ marginBottom: '20px', borderBottom: '2px dashed #0ea5e9', paddingBottom: '10px' }}>
                                    <h3 style={{ fontWeight: '900', color: '#153abf', margin: 0 }}>SCRIPT_OF: {selectedResult.studentName}</h3>
                                    <p style={{ fontWeight: '700', color: '#029da2', margin: '5px 0' }}>Student ID: {selectedResult.studentId} | Score: {selectedResult.score}/{selectedResult.totalQuestions}</p>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                    {selectedExam.questions.map((q, idx) => {
                                          const studentAns = selectedResult.answers.find(a => a.questionId === q._id || a.questionId === `q${idx + 1}`);
                                          const isNotAnswered = !studentAns || !studentAns.selectedOption;

                                          return (
                                                <div key={idx} style={{
                                                      padding: '20px',
                                                      backgroundColor: '#f8fafc',
                                                      borderRadius: '15px',
                                                      border: '1px solid #e2e8f0',
                                                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                                }}>
                                                      {/* Question Text */}
                                                      <p style={{ fontWeight: '900', color: '#0f172a', marginBottom: '15px', fontSize: '16px' }}>
                                                            <span style={{ color: '#0ea5e9' }}>Q{idx + 1}.</span> {q.questionText}
                                                      </p>

                                                      {/* Options Grid */}
                                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                                            {['a', 'b', 'c', 'd'].map((optKey) => {
                                                                  const isCorrect = q.correctAnswer === optKey;
                                                                  const isSelected = studentAns?.selectedOption === optKey;

                                                                  // Color Logic
                                                                  let bgColor = '#ffffff';
                                                                  let borderColor = '#e2e8f0';
                                                                  let textColor = '#1e293b';

                                                                  if (isCorrect) {
                                                                        bgColor = '#dcfce7'; // Light Green
                                                                        borderColor = '#10b981'; // Bold Green
                                                                        textColor = '#064e3b';
                                                                  } else if (isSelected && !isCorrect) {
                                                                        bgColor = '#fee2e2'; // Light Red
                                                                        borderColor = '#ef4444'; // Bold Red
                                                                        textColor = '#7f1d1d';
                                                                  }

                                                                  return (
                                                                        <div key={optKey} style={{
                                                                              padding: '12px',
                                                                              borderRadius: '10px',
                                                                              border: `2px solid ${borderColor}`,
                                                                              backgroundColor: bgColor,
                                                                              color: textColor,
                                                                              fontWeight: '700',
                                                                              display: 'flex',
                                                                              alignItems: 'center',
                                                                              gap: '10px',
                                                                              position: 'relative'
                                                                        }}>
                                                                              <span style={{
                                                                                    width: '24px', height: '24px', borderRadius: '50%',
                                                                                    backgroundColor: isCorrect ? '#10b981' : (isSelected ? '#ef4444' : '#0ea5e9'),
                                                                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                                                                              }}>
                                                                                    {optKey.toUpperCase()}
                                                                              </span>
                                                                              {q.options[optKey]}

                                                                              {isSelected && (
                                                                                    <span style={{ fontSize: '10px', fontWeight: '900', marginLeft: 'auto' }}>
                                                                                          {isCorrect ? '✓ YOUR_ANS' : '✕ YOUR_ANS'}
                                                                                    </span>
                                                                              )}
                                                                        </div>
                                                                  );
                                                            })}
                                                      </div>

                                                      {/* If Not Answered Warning */}
                                                      {isNotAnswered && (
                                                            <p style={{ marginTop: '10px', color: '#f59e0b', fontWeight: '900', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                  <AlertCircle size={14} /> STUDENT_DID_NOT_ANSWER_THIS_QUESTION
                                                            </p>
                                                      )}
                                                </div>
                                          );
                                    })}
                              </div>
                        </div>
                  ) : (
                        /* --- Individual Results Scoreboard --- */
                        <div>
                              <div style={{ backgroundColor: '#0ea5e9', padding: '25px', borderRadius: '20px', color: 'white', marginBottom: '25px' }}>
                                    <h3 style={{ margin: 0, fontWeight: '900', fontSize: '22px' }}>{selectedExam.title}</h3>
                                    <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '14px', fontWeight: '600' }}>Total Questions: {selectedExam.questions.length} | Total Candidates: {results.length}</p>
                              </div>

                              <div style={{ backgroundColor: '#bdd1f2', borderRadius: '20px', border: '1px solid #08090b', overflow: 'hidden', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                          <thead>
                                                <tr style={{ backgroundColor: '#078209', color: 'white', borderBottom: '1px solid #f88400' }}>
                                                      <th style={{ padding: '15px 20px', fontWeight: '900' }}>STUDENT_NAME</th>
                                                      <th style={{ padding: '15px 20px', fontWeight: '900' }}>SCORE</th>
                                                      <th style={{ padding: '15px 20px', fontWeight: '900' }}>PERCENTAGE</th>
                                                      <th style={{ padding: '15px 20px', fontWeight: '900' }}>STATUS</th>
                                                      <th style={{ padding: '15px 20px', fontWeight: '900' }}>ACTION</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {results.length > 0 ? results.map((res) => {
                                                      const percent = (res.score / res.totalQuestions) * 100;
                                                      return (
                                                            <tr key={res._id} style={{ borderBottom: '1px solid #00c90a' }}>
                                                                  <td style={{ padding: '15px 20px', fontWeight: '700', color: '#000000' }}>{res.studentName}</td>
                                                                  <td style={{ padding: '15px 20px', fontWeight: '900', color: '#000000' }}>{res.score}/{res.totalQuestions}</td>
                                                                  <td style={{ padding: '15px 20px', fontWeight: '700', color: '#000000' }}>{percent.toFixed(1)}%</td>
                                                                  <td style={{ padding: '15px 20px', fontWeight: '700', color: '#000000' }}>
                                                                        <span style={{ backgroundColor: percent >= 40 ? '#dcfce7' : '#fee2e2', color: percent >= 40 ? '#10b981' : '#ef4444', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '900' }}>
                                                                              {percent >= 40 ? "PASSED" : "FAILED"}
                                                                        </span>
                                                                  </td>
                                                                  <td style={{ padding: '15px 20px' }}>
                                                                        <button
                                                                              onClick={() => setSelectedResult(res)}
                                                                              style={{ background: 'white', border: '1px solid #0ea5e9', color: '#ff0000', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                                                                        >
                                                                              VIEW_SCRIPT
                                                                        </button>
                                                                  </td>
                                                            </tr>
                                                      );
                                                }) : (
                                                      <tr>
                                                            <td colSpan="5" style={{ padding: '20px', textAlign: 'center', fontWeight: '800' }}>NO RESULTS FOUND FOR THIS EXAM</td>
                                                      </tr>
                                                )}
                                          </tbody>
                                    </table>
                              </div>
                        </div>
                  )}
            </div>
      );
}