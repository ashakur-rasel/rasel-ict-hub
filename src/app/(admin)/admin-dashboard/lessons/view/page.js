"use client";
import { useState, useEffect } from "react";
import { BookOpen, Monitor, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudyPortal() {
      const [lessons, setLessons] = useState([]);
      const [selectedChapter, setSelectedChapter] = useState(null);
      const [selectedTopic, setSelectedTopic] = useState(null);
      const [loading, setLoading] = useState(true);

      const [zoomImage, setZoomImage] = useState(null);
      const [scale, setScale] = useState(1);
      const [position, setPosition] = useState({ x: 0, y: 0 });

      // গুগল ড্রাইভ ইমেজের ডিরেক্ট লিঙ্ক জেনারেটর (Fixed Syntax)
      const getDirectLink = (url) => {
            if (!url) return "";

            // ১. ড্রাইভ আইডি বের করা
            const match = url.match(/(?:\/d\/|id=)([\w-]+)/);

            if (match && match[1]) {
                  const fileId = match[1];
                  // ২. ড্রাইভের থাম্বনেইল এপিআই যা সিকিউরিটি ব্লক এড়িয়ে ইমেজ দেখাবে
                  // sz=w1000 দিয়ে হাই রেজোলিউশন নিশ্চিত করা হয়েছে
                  return "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000";
            }

            return url;
      };

      useEffect(() => {
            fetch('/api/lessons').then(res => res.json()).then(data => {
                  if (data.success) setLessons(data.lessons || []);
                  setLoading(false);
            });
      }, []);

      const handleZoom = (delta) => {
            setScale(prev => Math.min(Math.max(prev + delta, 0.5), 10));
      };

      const resetZoom = () => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
      };

      return (
            <div style={{ minHeight: '100vh', backgroundColor: '#a1f1f7e4', color: '#1e293b', fontFamily: 'var(--font-rajdhani), sans-serif', padding: '20px' }}>

                  {/* Header */}
                  <div style={{ maxWidth: '1000px', backgroundColor: '#5077d3', margin: '0 auto 30px', textAlign: 'center', borderRadius: '12px', padding: '15px' }}>
                        <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '900', color: '#0f172a' }}>ICT_COMMAND_CENTER</h1>
                        <p style={{ color: '#1a282f', fontWeight: 'bold', fontSize: '12px', letterSpacing: '2px' }}>VIRTUAL LECTURE MODE</p>
                  </div>

                  {/* Selectors */}
                  <div style={{ maxWidth: '1000px', margin: '0 auto 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        <select onChange={(e) => { setSelectedChapter(lessons.find(l => l.chapter === e.target.value)); setSelectedTopic(null); }} style={{ width: '100%', backgroundColor: '#f9ffa9', padding: '15px', borderRadius: '12px', border: '2px solid #000000', fontWeight: 'bold', outline: 'none' }}>
                              <option value="">-- SELECT CHAPTER --</option>
                              {lessons.map(l => <option key={l.chapter} value={l.chapter}>CH-{l.chapter}: {l.chapterTitle}</option>)}
                        </select>
                        <select disabled={!selectedChapter} onChange={(e) => setSelectedTopic(selectedChapter.topics.find(t => t._id === e.target.value))} style={{ width: '100%', backgroundColor: '#f9ffa9', padding: '15px', borderRadius: '12px', border: '2px solid #000000', fontWeight: 'bold', outline: 'none' }}>
                              <option value="">-- SELECT TOPIC --</option>
                              {selectedChapter?.topics.map(t => <option key={t._id} value={t._id}>{t.topicName}</option>)}
                        </select>
                  </div>

                  {/* Main Viewer */}
                  <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px', padding: 'clamp(20px, 5vw, 40px)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        {selectedTopic ? (
                              <div>
                                    <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', borderLeft: '6px solid #0ea5e9', paddingLeft: '15px', marginBottom: '30px' }}>{selectedTopic.topicName}</h2>

                                    {/* HTML Content (Rich Text) - overflow ফিক্স করা হয়েছে */}
                                    <div
                                          className="theory-content"
                                          dangerouslySetInnerHTML={{ __html: selectedTopic.content }}
                                          style={{
                                                fontSize: '18px',
                                                lineHeight: '1.8',
                                                color: '#334155',
                                                marginBottom: '40px',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word'
                                          }}
                                    />

                                    {/* Images Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                          {selectedTopic.images?.map((img, idx) => (
                                                <div key={idx} style={{ textAlign: 'center' }}>
                                                      <div onClick={() => { setZoomImage(getDirectLink(img)); resetZoom(); }} style={{ position: 'relative', cursor: 'zoom-in', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', height: '250px', backgroundColor: '#f8fafc' }}>
                                                            <img
                                                                  src={getDirectLink(img)}
                                                                  alt="Lecture Resource"
                                                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                            />
                                                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#0ea5e9', padding: '6px', borderRadius: '8px' }}><ZoomIn size={18} color="white" /></div>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        ) : (
                              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                    <Monitor size={64} color="#cbd5e1" />
                                    <p style={{ marginTop: '20px', color: '#94a3b8', fontWeight: 'bold' }}>CHOOSE A TOPIC TO PREVIEW CONTENT</p>
                              </div>
                        )}
                  </div>

                  <AnimatePresence>
                        {zoomImage && (
                              <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                              >
                                    <div style={{ position: 'absolute', top: '20px', display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '40px', backdropFilter: 'blur(10px)', zIndex: 10000 }}>
                                          <button onClick={() => handleZoom(0.5)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}><ZoomIn size={24} /></button>
                                          <button onClick={() => handleZoom(-0.5)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}><ZoomOut size={24} /></button>
                                          <button onClick={resetZoom} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}><RotateCcw size={24} /></button>
                                          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>
                                          <button onClick={() => setZoomImage(null)} style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                                    </div>

                                    <div style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <motion.img
                                                drag={scale > 1}
                                                animate={{ scale: scale }}
                                                src={zoomImage}
                                                style={{ maxHeight: '85vh', maxWidth: '90vw', objectFit: 'contain' }}
                                          />
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  <style jsx global>{`
                        .theory-content b, .theory-content strong { font-weight: 800; color: #0f172a; }
                        .theory-content u { text-decoration: underline; text-decoration-color: #0ea5e9; }
                        .theory-content h1, .theory-content h2, .theory-content h3 { color: #0ea5e9; margin-top: 25px; margin-bottom: 10px; font-weight: 800; }
                        .theory-content p { margin-bottom: 15px; }
                        .theory-content ul, .theory-content ol { padding-left: 25px; margin-bottom: 20px; }
                        .theory-content li { margin-bottom: 8px; }
                  `}</style>
            </div>
      );
}