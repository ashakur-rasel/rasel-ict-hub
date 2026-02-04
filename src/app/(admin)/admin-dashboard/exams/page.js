"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Calendar, Clock, Award, CheckCircle, AlertCircle, History } from "lucide-react";

export default function ExamCreator() {
      const router = useRouter();
      const [examData, setExamData] = useState({
            title: "",
            date: "",
            startTime: "",
            duration: "",
            totalMarks: 0,
            questions: [{ questionText: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "a" }]
      });

      const [toast, setToast] = useState(null);

      const showNotification = (msg, type = "success") => {
            setToast({ msg, type });
            setTimeout(() => setToast(null), 4000);
      };

      const addQuestion = () => {
            setExamData({
                  ...examData,
                  questions: [...examData.questions, { questionText: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "a" }]
            });
      };

      const removeQuestion = (index) => {
            if (examData.questions.length === 1) return showNotification("At least one question is required!", "error");
            const updatedQuestions = examData.questions.filter((_, i) => i !== index);
            setExamData({ ...examData, questions: updatedQuestions });
      };

      const handleQuestionChange = (index, field, value) => {
            const updatedQuestions = [...examData.questions];
            if (field.includes(".")) {
                  const [opt, key] = field.split(".");
                  updatedQuestions[index].options[key] = value;
            } else {
                  updatedQuestions[index][field] = value;
            }
            setExamData({ ...examData, questions: updatedQuestions });
      };

      const submitExam = async () => {
            if (!examData.title || !examData.date || !examData.startTime) {
                  return showNotification("Title, Date, and Start Time are required!", "error");
            }

            try {
                  const res = await fetch('/api/exams', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              ...examData,
                              totalMarks: examData.questions.length
                        })
                  });
                  const data = await res.json();
                  if (data.success) {
                        showNotification("Exam Published Successfully! 🚀");
                  } else {
                        showNotification(data.error || "Something went wrong", "error");
                  }
            } catch (err) {
                  showNotification("Server Connection Failed!", "error");
            }
      };

      return (
            <div style={{ padding: '15px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', color: '#1e293b' }}>

                  {/* Notification Toast */}
                  {toast && (
                        <div style={{
                              position: 'fixed', top: '20px', right: '20px', padding: '15px 25px', borderRadius: '12px', zIndex: 9999,
                              backgroundColor: toast.type === "success" ? '#10b981' : '#ef4444', color: 'white', fontWeight: '900',
                              display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }}>
                              {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                              {toast.msg}
                        </div>
                  )}

                  {/* Header Section */}
                  <div style={{
                        backgroundColor: '#0f172a',
                        padding: '25px',
                        borderRadius: '20px',
                        color: 'white',
                        marginBottom: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                  }}>
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                              <div>
                                    <h2 style={{ margin: 0, fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '900' }}>CREATE_NEW_LIVE_EXAM</h2>
                                    <p style={{ opacity: 0.7, fontSize: '13px', margin: '5px 0 0 0' }}>Set your questions and timing for students.</p>
                              </div>
                              <button
                                    onClick={() => router.push('/admin-dashboard/exams/history')}
                                    style={{
                                          padding: '10px 20px',
                                          backgroundColor: '#3b82f6',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '12px',
                                          fontWeight: '800',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          cursor: 'pointer',
                                          fontSize: '14px'
                                    }}
                              >
                                    <History size={18} /> EXAM_HISTORY
                              </button>
                        </div>
                  </div>

                  {/* Config Section - Grid Responsive */}
                  <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '15px',
                        marginBottom: '25px',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0'
                  }}>
                        <div>
                              <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px', fontSize: '14px' }}>EXAM_TITLE</label>
                              <input type="text" placeholder="e.g. Model Test 01" onChange={(e) => setExamData({ ...examData, title: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #f1f5f9', outline: 'none', color: '#1e293b', fontWeight: '700', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                              <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px', fontSize: '14px' }}>EXAM_DATE</label>
                              <input type="date" onChange={(e) => setExamData({ ...examData, date: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #f1f5f9', color: '#1e293b', fontWeight: '700', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                              <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px', fontSize: '14px' }}>START_TIME</label>
                              <input type="time" onChange={(e) => setExamData({ ...examData, startTime: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #f1f5f9', color: '#1e293b', fontWeight: '700', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                              <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px', fontSize: '14px' }}>DURATION (MIN)</label>
                              <input type="number" placeholder="30" onChange={(e) => setExamData({ ...examData, duration: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #f1f5f9', color: '#1e293b', fontWeight: '700', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ textAlign: 'center', backgroundColor: '#f0f9ff', borderRadius: '15px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <p style={{ margin: 0, fontSize: '12px', color: '#0369a1', fontWeight: '900' }}>AUTO_TOTAL_MARKS</p>
                              <h3 style={{ margin: 0, color: '#0ea5e9', fontSize: '24px', fontWeight: '900' }}>{examData.questions.length}</h3>
                        </div>
                  </div>

                  {/* Questions Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {examData.questions.map((q, index) => (
                              <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                                          <span style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '6px 15px', borderRadius: '10px', fontWeight: '900', fontSize: '14px' }}>QUESTION_{index + 1}</span>
                                          <button onClick={() => removeQuestion(index)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trash2 size={18} /></button>
                                    </div>

                                    <textarea
                                          placeholder="Write your question here..."
                                          value={q.questionText}
                                          onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                                          style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #f1f5f9', height: '80px', marginBottom: '15px', color: '#0f172a', fontWeight: '700', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                                    />

                                    {/* Options Grid Responsive */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                                          {['a', 'b', 'c', 'd'].map(opt => (
                                                <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                                      <span style={{ fontWeight: '900', color: '#0ea5e9', fontSize: '14px' }}>{opt.toUpperCase()}</span>
                                                      <input
                                                            type="text"
                                                            placeholder={`Option ${opt}`}
                                                            value={q.options[opt]}
                                                            onChange={(e) => handleQuestionChange(index, `options.${opt}`, e.target.value)}
                                                            style={{ background: 'none', border: 'none', outline: 'none', width: '100%', color: '#1e293b', fontWeight: '700', fontSize: '14px' }}
                                                      />
                                                </div>
                                          ))}
                                    </div>

                                    <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                          <label style={{ fontWeight: '900', fontSize: '14px', color: '#10b981' }}>CORRECT_ANSWER:</label>
                                          <select
                                                value={q.correctAnswer}
                                                onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                                                style={{ padding: '8px 15px', borderRadius: '10px', border: '2px solid #10b981', color: '#10b981', fontWeight: '900', cursor: 'pointer', backgroundColor: 'white', outline: 'none' }}
                                          >
                                                <option value="a">Option A</option>
                                                <option value="b">Option B</option>
                                                <option value="c">Option C</option>
                                                <option value="d">Option D</option>
                                          </select>
                                    </div>
                              </div>
                        ))}
                  </div>

                  {/* Bottom Actions Responsive */}
                  <div style={{
                        marginTop: '30px',
                        display: 'flex',
                        gap: '15px',
                        flexDirection: typeof window !== 'undefined' && window.innerWidth < 600 ? 'column' : 'row'
                  }}>
                        <button
                              onClick={addQuestion}
                              style={{ flex: 1, padding: '16px', backgroundColor: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px' }}
                        >
                              <Plus size={20} /> ADD_NEXT_QUESTION
                        </button>
                        <button
                              onClick={submitExam}
                              style={{ flex: 1, padding: '16px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px' }}
                        >
                              <Save size={20} /> PUBLISH_EXAM_NOW
                        </button>
                  </div>
            </div>
      );
}