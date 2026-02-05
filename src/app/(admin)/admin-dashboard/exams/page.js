"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
      Plus, Trash2, Save, Calendar, Clock, Award,
      CheckCircle2, AlertCircle, History, Loader2, X
} from "lucide-react";

export default function ExamCreator() {
      const router = useRouter();
      const [examData, setExamData] = useState({
            title: "", date: "", startTime: "", duration: "", totalMarks: 0,
            questions: [{ questionText: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "a" }]
      });
      const [loading, setLoading] = useState(false);
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
            if (examData.questions.length === 1) return showNotification("MINIMUM_ONE_QUESTION_REQUIRED", "error");
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
                  return showNotification("FILL_ALL_REQUIRED_PROTOCOL_FIELDS", "error");
            }
            setLoading(true);
            try {
                  const res = await fetch('/api/exams', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...examData, totalMarks: examData.questions.length })
                  });
                  const data = await res.json();
                  if (data.success) {
                        showNotification("EXAM_STATION_LIVE_AND_SYNCED", "success");
                        router.push('/admin-dashboard/exams/history');
                  }
            } catch (err) { showNotification("SERVER_LINK_ERROR", "error"); }
            finally { setLoading(false); }
      };

      return (
            <div style={{ padding: '10px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif' }}>

                  {toast && (
                        <div style={{ position: 'fixed', top: '30px', right: '30px', padding: '18px 25px', borderRadius: '15px', zIndex: 10000, backgroundColor: toast.type === "success" ? '#10b981' : '#f43f5e', color: 'white', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.4)', animation: 'slideIn 0.3s ease-out' }}>
                              {toast.type === "success" ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />} {toast.msg}
                        </div>
                  )}

                  <div style={{ backgroundColor: '#0f172a', padding: 'clamp(20px, 4vw, 35px)', borderRadius: '35px', border: '1px solid #1e293b', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                              <h2 style={{ color: 'white', margin: 0, fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: '900', fontStyle: 'italic' }}>EXAM_CREATOR_LAB</h2>
                              <p style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '900', letterSpacing: '3px', margin: '5px 0 0 0' }}>VIRTUAL ASSESSMENT ENGINE</p>
                        </div>
                        <button onClick={() => router.push('/admin-dashboard/exams/history')} style={{ padding: '12px 25px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '14px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.3s' }}>
                              <History size={18} color="#0ea5e9" /> VIEW_ARCHIVE
                        </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '20px', marginBottom: '30px', backgroundColor: '#0f172a', padding: '30px', borderRadius: '35px', border: '1px solid #1e293b' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '900' }}>EXAM_TITLE</label>
                              <input type="text" placeholder="e.g. MCQ Final" onChange={(e) => setExamData({ ...examData, title: e.target.value })} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '900' }}>DATE_NODE</label>
                              <input type="date" onChange={(e) => setExamData({ ...examData, date: e.target.value })} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '900' }}>START_PROTOCOL</label>
                              <input type="time" onChange={(e) => setExamData({ ...examData, startTime: e.target.value })} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', fontWeight: '700', outline: 'none' }} />
                        </div>
                        <div style={{ backgroundColor: '#1e293b', borderRadius: '15px', padding: '15px', textAlign: 'center', border: '1px solid #334155' }}>
                              <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: '900' }}>TOTAL_SCORE</p>
                              <h3 style={{ margin: 0, color: '#10b981', fontSize: '28px', fontWeight: '900' }}>{examData.questions.length}</h3>
                        </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {examData.questions.map((q, index) => (
                              <div key={index} style={{ backgroundColor: '#0f172a', padding: 'clamp(20px, 4vw, 35px)', borderRadius: '35px', border: '1px solid #1e293b', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                                          <span style={{ backgroundColor: '#0ea5e9', color: '#020617', padding: '6px 15px', borderRadius: '10px', fontWeight: '900', fontSize: '12px' }}>MODULE_STATION_{index + 1}</span>
                                          <button onClick={() => removeQuestion(index)} style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', borderRadius: '10px', padding: '8px', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                    </div>
                                    <textarea placeholder="Input question text..." value={q.questionText} onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                                          style={{ width: '100%', padding: '18px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '18px', color: 'white', fontWeight: '600', fontSize: '15px', outline: 'none', resize: 'none', marginBottom: '20px' }} />

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                                          {['a', 'b', 'c', 'd'].map(opt => (
                                                <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#020617', padding: '12px 15px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                                                      <span style={{ fontWeight: '900', color: '#38bdf8', fontSize: '15px' }}>{opt.toUpperCase()}</span>
                                                      <input type="text" placeholder={`Option ${opt}`} value={q.options[opt]} onChange={(e) => handleQuestionChange(index, `options.${opt}`, e.target.value)}
                                                            style={{ background: 'none', border: 'none', outline: 'none', width: '100%', color: 'white', fontWeight: '600' }} />
                                                </div>
                                          ))}
                                    </div>

                                    <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#1e293b', padding: '15px 20px', borderRadius: '15px' }}>
                                          <label style={{ fontWeight: '900', fontSize: '13px', color: '#10b981' }}>CORRECT_SIGNAL_KEY:</label>
                                          <select value={q.correctAnswer} onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                                                style={{ backgroundColor: '#020617', color: '#10b981', padding: '8px 15px', borderRadius: '10px', border: '1px solid #10b981', fontWeight: '900', outline: 'none', cursor: 'pointer' }}>
                                                {['A', 'B', 'C', 'D'].map(val => <option key={val} value={val.toLowerCase()}>Option {val}</option>)}
                                          </select>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <button onClick={addQuestion} style={{ padding: '20px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '15px' }}>
                              <Plus size={20} color="#38bdf8" /> NEXT_COMPONENT
                        </button>
                        <button onClick={submitExam} disabled={loading} style={{ padding: '20px', backgroundColor: '#0ea5e9', color: '#020617', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '15px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>
                              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} PUBLISH_TO_NETWORK
                        </button>
                  </div>
            </div>
      );
}