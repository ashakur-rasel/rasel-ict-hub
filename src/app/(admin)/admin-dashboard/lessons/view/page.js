"use client";
import { useState, useEffect, useRef } from "react";
import { BookOpen, ChevronDown, Monitor, X, ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudyPortal() {
      const [lessons, setLessons] = useState([]);
      const [selectedChapter, setSelectedChapter] = useState(null);
      const [selectedTopic, setSelectedTopic] = useState(null);
      const [loading, setLoading] = useState(true);

      // জুম এবং প্যানিংয়ের জন্য নতুন স্টেট
      const [zoomImage, setZoomImage] = useState(null);
      const [scale, setScale] = useState(1);
      const [position, setPosition] = useState({ x: 0, y: 0 });

      const getDirectLink = (url) => {
            if (!url) return "";
            const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
            if (match && match[1]) {
                  return `https://lh3.googleusercontent.com/u/0/d/${match[1]}=w1000-iv1`;
            }
            return url;
      };

      useEffect(() => {
            fetch('/api/lessons').then(res => res.json()).then(data => {
                  if (data.success) setLessons(data.lessons || []);
                  setLoading(false);
            });
      }, []);

      // জুম কন্ট্রোল ফাংশন
      const handleZoom = (delta) => {
            setScale(prev => Math.min(Math.max(prev + delta, 0.5), 10)); // ০.৫x থেকে ১০x পর্যন্ত জুম
      };

      const resetZoom = () => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
      };

      return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'var(--font-rajdhani), sans-serif', padding: '20px' }}>

                  {/* Header & Selectors (Same as before) */}
                  <div style={{ maxWidth: '1000px', margin: '0 auto 30px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '900', color: '#0f172a' }}>ICT_COMMAND_CENTER</h1>
                        <p style={{ color: '#0ea5e9', fontWeight: 'bold', fontSize: '12px', letterSpacing: '2px' }}>VIRTUAL LECTURE MODE</p>
                  </div>

                  <div style={{ maxWidth: '1000px', margin: '0 auto 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        <select onChange={(e) => { setSelectedChapter(lessons.find(l => l.chapter === e.target.value)); setSelectedTopic(null); }} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontWeight: 'bold' }}>
                              <option value="">-- SELECT CHAPTER --</option>
                              {lessons.map(l => <option key={l.chapter} value={l.chapter}>CH-{l.chapter}: {l.chapterTitle}</option>)}
                        </select>
                        <select disabled={!selectedChapter} onChange={(e) => setSelectedTopic(selectedChapter.topics.find(t => t._id === e.target.value))} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontWeight: 'bold' }}>
                              <option value="">-- SELECT TOPIC --</option>
                              {selectedChapter?.topics.map(t => <option key={t._id} value={t._id}>{t.topicName}</option>)}
                        </select>
                  </div>

                  {/* Main Content Viewer */}
                  <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                        {selectedTopic ? (
                              <div>
                                    <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', borderLeft: '6px solid #0ea5e9', paddingLeft: '15px', marginBottom: '30px' }}>{selectedTopic.topicName}</h2>
                                    <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>{selectedTopic.content}</div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                                          {selectedTopic.images?.map((img, idx) => (
                                                <div key={idx} style={{ textAlign: 'center' }}>
                                                      <div onClick={() => { setZoomImage(getDirectLink(img)); resetZoom(); }} style={{ position: 'relative', cursor: 'zoom-in', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', height: '250px' }}>
                                                            <img src={getDirectLink(img)} alt="ICT" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#0ea5e9', padding: '6px', borderRadius: '8px' }}><ZoomIn size={18} color="white" /></div>
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                        ) : <div style={{ textAlign: 'center', padding: '60px 0' }}><Monitor size={64} color="#cbd5e1" /></div>}
                  </div>

                  {/* Advanced Zoom Modal */}
                  <AnimatePresence>
                        {zoomImage && (
                              <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                              >
                                    {/* Toolbar */}
                                    <div style={{ position: 'absolute', top: '20px', display: 'flex', gap: '15px', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '40px', backdropFilter: 'blur(10px)', zIndex: 10000 }}>
                                          <button onClick={() => handleZoom(0.5)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}><ZoomIn size={24} /></button>
                                          <button onClick={() => handleZoom(-0.5)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}><ZoomOut size={24} /></button>
                                          <button onClick={resetZoom} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}><RotateCcw size={24} /></button>
                                          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>
                                          <button onClick={() => setZoomImage(null)} style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                                    </div>

                                    {/* Zoomable Image Container */}
                                    <div
                                          style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: scale > 1 ? 'grab' : 'default' }}
                                          onWheel={(e) => handleZoom(e.deltaY > 0 ? -0.2 : 0.2)}
                                    >
                                          <motion.img
                                                drag={scale > 1} // ১x এর বেশি জুম হলেই কেবল ড্র্যাগ করা যাবে
                                                dragConstraints={{ left: -500 * scale, right: 500 * scale, top: -500 * scale, bottom: 500 * scale }}
                                                animate={{ scale: scale, x: position.x, y: position.y }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                src={zoomImage}
                                                style={{ maxHeight: '85vh', maxWidth: '90vw', objectFit: 'contain', userSelect: 'none' }}
                                          />
                                    </div>

                                    <p style={{ position: 'absolute', bottom: '20px', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                                          SCROLL TO ZOOM • DRAG TO MOVE • ZOOM: {Math.round(scale * 100)}%
                                    </p>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}