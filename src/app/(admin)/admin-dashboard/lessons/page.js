"use client";
import { useState, useEffect } from "react";
import { BookOpen, Trash2, Loader2, ExternalLink, Type, Plus, Save, CheckCircle2, XCircle, Info } from "lucide-react";
import Link from "next/link";
import {
      Editor,
      EditorProvider,
      Toolbar,
      BtnBold,
      BtnItalic,
      BtnUnderline,
      BtnStrikeThrough,
      BtnNumberedList,
      BtnBulletList,
      BtnLink,
      BtnClearFormatting,
      BtnStyles
} from 'react-simple-wysiwyg';

export default function LessonBuilder() {
      const chapters = {
            "1": "বিশ্ব ও বাংলাদেশ প্রেক্ষাপটে তথ্য ও যোগাযোগ প্রযুক্তি",
            "2": "কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং",
            "3.1": "সংখ্যা পদ্ধতি (Number Systems)",
            "3.2": "ডিজিটাল ডিভাইস (Digital Devices)",
            "4": "ওয়েব ডিজাইন পরিচিতি এবং HTML",
            "5": "প্রোগ্রামিং ভাষা (Programming Language)",
            "6": "ডেটাবেস ম্যানেজমেন্ট সিস্টেম"
      };

      const [formData, setFormData] = useState({
            chapter: "1", topicName: "", content: "", images: [""]
      });
      const [lessons, setLessons] = useState([]);
      const [loading, setLoading] = useState(false);
      const [toast, setToast] = useState(null);

      const showNotification = (msg, type = "success") => {
            setToast({ msg, type });
            setTimeout(() => setToast(null), 4000);
      };

      const fetchLessons = async () => {
            try {
                  const res = await fetch('/api/lessons');
                  const data = await res.json();
                  if (data.success) setLessons(data.lessons || []);
            } catch (e) { console.error(e); }
      };

      useEffect(() => { fetchLessons(); }, []);

      const handleImageChange = (index, value) => {
            const updatedImages = [...formData.images];
            updatedImages[index] = value;
            setFormData({ ...formData, images: updatedImages });
      };

      const saveLesson = async () => {
            if (!formData.topicName || !formData.content) {
                  return showNotification("Topic and Content Required!", "error");
            }
            setLoading(true);
            try {
                  const cleanImages = formData.images.filter(img => img && img.trim() !== "");
                  const res = await fetch('/api/lessons', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              ...formData,
                              chapterTitle: chapters[formData.chapter],
                              images: cleanImages
                        })
                  });
                  const data = await res.json();
                  if (data.success) {
                        showNotification("LESSON_SYNTHESIZED_SUCCESSFULLY", "success");
                        setFormData({ chapter: "1", topicName: "", content: "", images: [""] });
                        fetchLessons();
                  }
            } catch (error) { showNotification("SYNC_FAILED", "error"); }
            finally { setLoading(false); }
      };

      const deleteTopic = async (chapter, topicId) => {
            try {
                  const res = await fetch(`/api/lessons?chapter=${chapter}&topicId=${topicId}`, { method: 'DELETE' });
                  const data = await res.json();
                  if (data.success) {
                        showNotification("TOPIC_PURGED_FROM_CORE", "success");
                        fetchLessons();
                  }
            } catch (e) { showNotification("DELETE_FAILED", "error"); }
      };

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', padding: '10px 10px 100px' }}>

                  {toast && (
                        <div style={{
                              position: 'fixed', top: '30px', right: '30px', padding: '15px 25px', borderRadius: '15px', zIndex: 10000,
                              backgroundColor: toast.type === "success" ? '#10b981' : '#f43f5e', color: 'white', fontWeight: '900',
                              display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                              animation: 'slideIn 0.3s ease-out'
                        }}>
                              {toast.type === "success" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                              {toast.msg}
                        </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                              <h2 style={{ color: '#38bdf8', fontWeight: '900', fontStyle: 'italic', margin: 0, fontSize: 'clamp(20px, 4vw, 28px)' }}>CONTENT_ENGINEER_LAB</h2>
                              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '900', letterSpacing: '2px' }}>SYSTEM_CORE_SYLLABUS</p>
                        </div>
                        <Link href="/admin-dashboard/lessons/view" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', backgroundColor: '#0ea5e9', color: '#020617', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '13px', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.4)' }}>
                              <ExternalLink size={16} /> LIVE_PREVIEW
                        </Link>
                  </div>

                  <div style={{ backgroundColor: '#000000', border: '1px solid #1e293b', padding: 'clamp(20px, 4vw, 35px)', borderRadius: '35px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'grid', gap: '25px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '900' }}>CHAPTER_SELECT</label>
                                          <select value={formData.chapter} onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                                style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid #1e293b', color: 'white', borderRadius: '12px', outline: 'none', fontWeight: '700' }}>
                                                {Object.keys(chapters).map(key => <option key={key} value={key}>CH_{key}: {chapters[key]}</option>)}
                                          </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '900' }}>TOPIC_TITLE</label>
                                          <input type="text" placeholder="e.g. Logic Gates Deep Dive" value={formData.topicName}
                                                style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid #1e293b', color: 'white', borderRadius: '12px', outline: 'none', fontWeight: '700' }}
                                                onChange={(e) => setFormData({ ...formData, topicName: e.target.value })} />
                                    </div>
                              </div>

                              <div style={{ backgroundColor: '#060a1e', borderRadius: '15px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                                    <p style={{ padding: '12px 20px', margin: 0, fontSize: '11px', color: '#38bdf8', fontWeight: '900', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#1e293b' }}>
                                          <Type size={16} /> THEORY_RICH_TEXT_INPUT
                                    </p>
                                    <EditorProvider>
                                          <Editor value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                containerProps={{ style: { height: '400px', color: '#72b8ff', backgroundColor: '#010b38', border: 'none' } }}>
                                                <Toolbar>
                                                      <BtnStyles /> <BtnBold /> <BtnItalic /> <BtnUnderline /> <BtnStrikeThrough />
                                                      <BtnNumberedList /> <BtnBulletList /> <BtnLink /> <BtnClearFormatting />
                                                </Toolbar>
                                          </Editor>
                                    </EditorProvider>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '900' }}>RESOURCE_ATTACHMENTS (Google Drive Thumbnails Supported)</label>
                                    {formData.images.map((img, idx) => (
                                          <input key={idx} type="text" placeholder="Paste Drive/Image URL here..." value={img}
                                                style={{ padding: '14px', backgroundColor: '#020617', border: '1px solid #1e293b', color: '#10b981', borderRadius: '12px', outline: 'none', fontWeight: '600', fontSize: '13px' }}
                                                onChange={(e) => handleImageChange(idx, e.target.value)} />
                                    ))}
                                    <button onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })}
                                          style={{ width: 'fit-content', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px dashed #38bdf8', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: '900' }}>
                                          + ADD_RESOURCE_NODE
                                    </button>
                              </div>

                              <button onClick={saveLesson} disabled={loading} style={{
                                    padding: '20px', backgroundColor: '#10b981', color: '#020617', fontWeight: '900',
                                    borderRadius: '18px', cursor: 'pointer', border: 'none', transition: '0.3s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '16px'
                              }}>
                                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {loading ? "TRANSMITTING_DATA..." : "PUBLISH_TO_CORE_DATABASE"}
                              </button>
                        </div>
                  </div>

                  <div style={{ marginTop: '50px', backgroundColor: '#0f172a', borderRadius: '35px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                        <div style={{ padding: '25px 30px', backgroundColor: '#1e293b', color: '#38bdf8', fontWeight: '900', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <BookOpen size={20} /> SYLLABUS_MANAGEMENT_INDEX
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px' }}>
                                    <thead style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                                          <tr style={{ borderBottom: '1px solid #1e293b' }}>
                                                <th style={{ padding: '20px' }}>Chapter</th>
                                                <th style={{ padding: '20px' }}>Topic_Identity</th>
                                                <th style={{ padding: '20px', textAlign: 'right' }}>Security_Command</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {lessons.map(lesson => (
                                                lesson.topics.map(topic => (
                                                      <tr key={topic._id} style={{ borderBottom: '1px solid #1e293b', transition: '0.2s' }}>
                                                            <td style={{ padding: '20px', color: '#0ea5e9', fontWeight: '900' }}>CH_{lesson.chapter}</td>
                                                            <td style={{ padding: '20px', color: 'white', fontWeight: '700' }}>{topic.topicName}</td>
                                                            <td style={{ padding: '20px', textAlign: 'right' }}>
                                                                  <button onClick={() => deleteTopic(lesson.chapter, topic._id)} style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', color: '#f43f5e', cursor: 'pointer' }}>
                                                                        <Trash2 size={16} />
                                                                  </button>
                                                            </td>
                                                      </tr>
                                                ))
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>

                  <style jsx global>{`
                        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                        .rsw-ce { color: white !important; padding: 20px !important; outline: none !important; min-height: 350px; font-family: inherit; font-size: 16px; line-height: 1.6; }
                        .rsw-ce b, .rsw-ce strong { font-weight: 800; color: #38bdf8; }
                        .rsw-ce h1, .rsw-ce h2 { color: #0ea5e9; border-bottom: 1px solid #1e293b; padding-bottom: 10px; }
                        .rsw-toolbar { background: #1e293b !important; border-bottom: 1px solid #334155 !important; padding: 10px !important; }
                        .rsw-btn { color: #94a3b8 !important; }
                        .rsw-btn:hover { color: #38bdf8 !important; background: #0f172a !important; }
                  `}</style>
            </div>
      );
}