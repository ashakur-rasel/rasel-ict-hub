"use client";
import { useState, useEffect } from "react";
import { BookOpen, Trash2, Loader2, ExternalLink, Type } from "lucide-react";
import Link from "next/link";

// এখানে Provider এর বদলে EditorProvider ব্যবহার করা হয়েছে
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
      BtnStyles // এটি যোগ করা হয়েছে হেডিং এর জন্য
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

      const fetchLessons = async () => {
            try {
                  const res = await fetch('/api/lessons');
                  const data = await res.json();
                  if (data.success) setLessons(data.lessons || []);
            } catch (e) { console.error("Fetch Error:", e); }
      };

      useEffect(() => { fetchLessons(); }, []);

      const handleImageChange = (index, value) => {
            const updatedImages = [...formData.images];
            updatedImages[index] = value;
            setFormData({ ...formData, images: updatedImages });
      };

      const saveLesson = async () => {
            if (!formData.topicName || !formData.content) return alert("Topic Name and Content are required!");
            setLoading(true);
            try {
                  const cleanImages = formData.images.filter(img => img && img.trim() !== "");
                  const res = await fetch('/api/lessons', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              chapter: formData.chapter,
                              chapterTitle: chapters[formData.chapter],
                              topicName: formData.topicName,
                              content: formData.content,
                              images: cleanImages
                        })
                  });

                  const data = await res.json();
                  if (data.success) {
                        alert("Lesson Synthesized Successfully! 🚀");
                        setFormData({ chapter: "1", topicName: "", content: "", images: [""] });
                        fetchLessons();
                  }
            } catch (error) {
                  alert("Sync Failed!");
            } finally {
                  setLoading(false);
            }
      };

      const deleteTopic = async (chapter, topicId) => {
            if (!confirm("Confirm Deletion?")) return;
            try {
                  const res = await fetch(`/api/lessons?chapter=${chapter}&topicId=${topicId}`, { method: 'DELETE' });
                  const data = await res.json();
                  if (data.success) {
                        alert("Topic Purged! 🗑️");
                        fetchLessons();
                  }
            } catch (e) { alert("Delete Failed!"); }
      };

      return (
            <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', paddingBottom: '100px' }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                              <h2 style={{ color: '#38bdf8', fontWeight: '900', fontStyle: 'italic', margin: 0 }}>CONTENT_ENGINEER_LAB</h2>
                              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>SYSTEM_CORE_SYLLABUS</p>
                        </div>
                        <Link href="/admin-dashboard/lessons/view" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
                              <ExternalLink size={16} /> LIVE_PREVIEW
                        </Link>
                  </div>

                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(25px)', padding: '30px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ display: 'grid', gap: '20px' }}>
                              <select
                                    value={formData.chapter} onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                    style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', outline: 'none' }}>
                                    {Object.keys(chapters).map(key => <option key={key} value={key}>CH_{key}: {chapters[key]}</option>)}
                              </select>

                              <input type="text" placeholder="Entry Topic Title" value={formData.topicName}
                                    style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', outline: 'none' }}
                                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })} />

                              {/* --- Fixed Editor with EditorProvider --- */}
                              <div style={{ backgroundColor: '#060a1e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                    <p style={{ padding: '10px 15px', margin: 0, fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                          <Type size={14} /> THEORY_CONTENT_INPUT
                                    </p>

                                    <EditorProvider>
                                          <Editor
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                containerProps={{ style: { height: '350px', color: '#44c1e0', backgroundColor: 'transparent', border: 'none' } }}
                                          >
                                                <Toolbar>
                                                      <BtnStyles /> {/* এটি দিয়ে তুমি H1, H2, H3 বা প্যারাগ্রাফ সিলেক্ট করে সাইজ বড়-ছোট করতে পারবে */}
                                                      <BtnBold />
                                                      <BtnItalic />
                                                      <BtnUnderline />
                                                      <BtnStrikeThrough />
                                                      <BtnNumberedList />
                                                      <BtnBulletList />
                                                      <BtnLink />
                                                      <BtnClearFormatting />
                                                </Toolbar>
                                          </Editor>
                                    </EditorProvider>
                              </div>

                              <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                                    {formData.images.map((img, idx) => (
                                          <input key={idx} type="text" placeholder={`Attachment URL ${idx + 1}`} value={img}
                                                style={{ padding: '12px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', color: 'white', borderRadius: '10px', outline: 'none' }}
                                                onChange={(e) => handleImageChange(idx, e.target.value)} />
                                    ))}
                                    <button onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })} style={{ background: 'rgba(56, 189, 248, 0.05)', color: '#38bdf8', border: '1px dashed rgba(56, 189, 248, 0.3)', padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px' }}>+ ATTACH_IMAGE_NODE</button>
                              </div>

                              <button onClick={saveLesson} disabled={loading} style={{ padding: '20px', backgroundColor: '#38bdf8', color: '#020617', fontWeight: '900', borderRadius: '15px', cursor: 'pointer', border: 'none', transition: '0.3s' }}>
                                    {loading ? "DATA_TRANSMITTING..." : "SAVE_TO_CORE_DB ⬆️"}
                              </button>
                        </div>
                  </div>

                  {/* ম্যানেজ সেকশন */}
                  <div style={{ marginTop: '50px', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ color: '#38bdf8', marginBottom: '20px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px' }}>
                              <BookOpen size={20} /> SYLLABUS_INDEX
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: 'white', minWidth: '600px' }}>
                                    <thead style={{ color: '#64748b', fontSize: '11px' }}>
                                          <tr style={{ borderBottom: '1px solid #334155' }}>
                                                <th style={{ padding: '15px' }}>CH</th>
                                                <th style={{ padding: '15px' }}>TOPIC_ID</th>
                                                <th style={{ padding: '15px', textAlign: 'right' }}>COMMAND</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {lessons.map(lesson => (
                                                lesson.topics.map(topic => (
                                                      <tr key={topic._id} style={{ borderBottom: '1px solid #1e293b', fontSize: '14px' }}>
                                                            <td style={{ padding: '15px', color: '#38bdf8', fontWeight: 'bold' }}>{lesson.chapter}</td>
                                                            <td style={{ padding: '15px' }}>{topic.topicName}</td>
                                                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                                                  <button onClick={() => deleteTopic(lesson.chapter, topic._id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
                                                                        <Trash2 size={18} />
                                                                  </button>
                                                            </td>
                                                      </tr>
                                                ))
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>

                  <style>{`
      .rsw-ce { color: white !important; padding: 15px !important; outline: none !important; min-height: 300px; }
      .rsw-ce b { font-weight: bold; color: #38bdf8; }
      .rsw-ce u { text-decoration: underline; }
      .rsw-ce h1 { font-size: 2.5rem; color: #38bdf8; }
      .rsw-ce h2 { font-size: 2rem; color: #38bdf8; }
      .rsw-ce h3 { font-size: 1.5rem; color: #38bdf8; }
      .rsw-toolbar { background: #1e293b !important; border-bottom: 1px solid #334155 !important; }
      /* ভিউ পেজের জন্য কিছু গ্লোবাল স্টাইল */
      .theory-content b { font-weight: 800; color: #38bdf8; }
      .theory-content u { text-decoration-color: #38bdf8; }
`}</style>
            </div>
      );
}