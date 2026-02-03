"use client";
import { useState, useEffect } from "react";
import { BookOpen, Send, Plus, Trash2, Loader2 } from "lucide-react";

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

      // লিসন ডাটা রাখার জন্য স্টেট
      const [lessons, setLessons] = useState([]);
      const [loading, setLoading] = useState(false);

      // ডাটাবেস থেকে কন্টেন্ট লোড করা
      const fetchLessons = async () => {
            try {
                  const res = await fetch('/api/lessons');
                  const data = await res.json();
                  if (data.success) setLessons(data.lessons || []);
            } catch (e) { console.error("Fetch Error:", e); }
      };

      useEffect(() => { fetchLessons(); }, []);

      const addImageField = () => setFormData({ ...formData, images: [...formData.images, ""] });

      const handleImageChange = (index, value) => {
            const updatedImages = [...formData.images];
            updatedImages[index] = value;
            setFormData({ ...formData, images: updatedImages });
      };

      const saveLesson = async () => {
            setLoading(true);
            try {
                  // ইমেজ লিস্ট থেকে খালি লিঙ্কগুলো ফিল্টার করা
                  const cleanImages = formData.images.filter(img => img && img.trim() !== "");

                  // কনসোলে চেক করো ডাটা রেডি কি না
                  console.log("Syncing to DB:", { ...formData, images: cleanImages });

                  const res = await fetch('/api/lessons', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              chapter: formData.chapter,
                              chapterTitle: chapters[formData.chapter],
                              topicName: formData.topicName,
                              content: formData.content,
                              images: cleanImages // নিশ্চিত করা যে ইমেজ এরে পাঠানো হচ্ছে
                        })
                  });

                  const data = await res.json();
                  if (data.success) {
                        alert("Lesson Uploaded! 🚀");
                        setFormData({ chapter: "1", topicName: "", content: "", images: [""] }); // ফর্ম রিসেট
                        fetchLessons();
                  } else {
                        alert("Error: " + data.error);
                  }
            } catch (error) {
                  alert("System Offline!");
            } finally {
                  setLoading(false);
            }
      };

      const deleteTopic = async (chapter, topicId) => {
            if (!confirm("Delete this topic?")) return;
            try {
                  const res = await fetch(`/api/lessons?chapter=${chapter}&topicId=${topicId}`, { method: 'DELETE' });
                  const data = await res.json();
                  if (data.success) {
                        alert("Topic Deleted! 🗑️");
                        fetchLessons();
                  }
            } catch (e) { alert("Delete Failed!"); }
      };

      return (
            <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', paddingBottom: '100px' }}>
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(25px)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <h2 style={{ color: '#38bdf8', fontWeight: '900', fontStyle: 'italic', marginBottom: '30px' }}>CONTENT_CREATOR_NODE</h2>

                        <div style={{ display: 'grid', gap: '20px' }}>
                              <select
                                    value={formData.chapter} onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                    style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px' }}>
                                    {Object.keys(chapters).map(key => <option key={key} value={key}>Chapter {key}: {chapters[key]}</option>)}
                              </select>

                              <input type="text" placeholder="Topic Name" value={formData.topicName}
                                    style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px' }}
                                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })} />

                              <textarea placeholder="Write Theory Content here..." value={formData.content}
                                    style={{ height: '200px', padding: '20px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px' }}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })} />

                              {formData.images.map((img, idx) => (
                                    <input key={idx} type="text" placeholder={`Drive Image URL ${idx + 1}`} value={img}
                                          style={{ padding: '12px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', color: 'white', borderRadius: '10px' }}
                                          onChange={(e) => handleImageChange(idx, e.target.value)} />
                              ))}
                              <button onClick={addImageField} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>+ ADD ANOTHER PHOTO</button>

                              <button onClick={saveLesson} disabled={loading} style={{ padding: '20px', backgroundColor: '#38bdf8', color: '#020617', fontWeight: '900', borderRadius: '15px', cursor: 'pointer' }}>
                                    {loading ? "INITIALIZING..." : "UPLOAD TO DATABASE ⬆️"}
                              </button>
                        </div>
                  </div>

                  {/* ম্যানেজ সেকশন */}
                  <div style={{ marginTop: '50px', backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ color: '#38bdf8', marginBottom: '20px', fontStyle: 'italic' }}>MANAGE_EXISTING_CONTENT</h3>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: 'white' }}>
                                    <thead style={{ color: '#64748b', fontSize: '11px' }}>
                                          <tr style={{ borderBottom: '1px solid #334155' }}>
                                                <th style={{ padding: '10px' }}>CHAPTER</th>
                                                <th style={{ padding: '10px' }}>TOPIC NAME</th>
                                                <th style={{ padding: '10px', textAlign: 'right' }}>ACTION</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {lessons.map(lesson => (
                                                lesson.topics.map(topic => (
                                                      <tr key={topic._id} style={{ borderBottom: '1px solid #1e293b' }}>
                                                            <td style={{ padding: '15px', color: '#38bdf8' }}>{lesson.chapter}</td>
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
            </div>
      );
}