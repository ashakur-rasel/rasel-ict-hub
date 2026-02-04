"use client";
import { useState, useEffect } from "react";
import { FolderPlus, FileText, Trash2, ExternalLink, FileType, Book, Layers, Eye } from "lucide-react";
import Link from "next/link";

export default function ResourceAdmin() {
      const categories = {
            "1": "CH_1: বিশ্ব ও বাংলাদেশ প্রেক্ষাপটে আইসিটি",
            "2": "CH_2: কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং",
            "3.1": "CH_3.1: সংখ্যা পদ্ধতি",
            "3.2": "CH_3.2: ডিজিটাল ডিভাইস",
            "4": "CH_4: ওয়েব ডিজাইন ও HTML",
            "5": "CH_5: প্রোগ্রামিং ভাষা",
            "6": "CH_6: ডেটাবেস ম্যানেজমেন্ট",
            "REF": "📚 Reference Books",
            "MODEL": "📝 Model Questions",
            "ANS": "✅ Model Answers",
            "OTH": "⚙️ Others Resource"
      };

      const fileTypes = ["PDF", "DOC", "PPT", "IMAGE", "SHEET", "VIDEO_LINK"];

      const [formData, setFormData] = useState({
            chapter: "1", title: "", fileType: "PDF", driveLink: ""
      });
      const [resources, setResources] = useState([]);
      const [loading, setLoading] = useState(false);

      const fetchResources = async () => {
            const res = await fetch('/api/resources');
            const data = await res.json();
            if (data.success) setResources(data.resources);
      };

      useEffect(() => { fetchResources(); }, []);

      const saveResource = async () => {
            if (!formData.title || !formData.driveLink) return alert("সবগুলো ঘর পূরণ করো!");
            setLoading(true);
            try {
                  const res = await fetch('/api/resources', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              ...formData,
                              chapterTitle: categories[formData.chapter]
                        })
                  });
                  const data = await res.json();
                  if (data.success) {
                        alert("রিসোর্স সাকসেসফুলি সেভ হয়েছে! 🚀");
                        setFormData({ ...formData, title: "", driveLink: "" });
                        fetchResources();
                  }
            } catch (e) { alert("সেভ করতে সমস্যা হয়েছে!"); }
            finally { setLoading(false); }
      };

      const deleteResource = async (id) => {
            if (!confirm("আপনি কি এটি ডিলিট করতে চান?")) return;
            const res = await fetch(`/api/resources?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) fetchResources();
      };

      return (
            <div style={{
                  maxWidth: '1100px',
                  margin: '0 auto',
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  paddingTop: '10px',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  paddingBottom: '100px'
            }}>

                  {/* Header with Navigation Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                              <h2 style={{ color: '#0ea5e9', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                                    <Layers size={28} /> RESOURCE_CORE
                              </h2>
                              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>ASSET_MANAGEMENT_NODE</p>
                        </div>

                        <Link
                              href="/admin-dashboard/resources/view"
                              target="_blank"
                              style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                                    backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9',
                                    border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '12px',
                                    textDecoration: 'none', fontWeight: 'bold', fontSize: '13px'
                              }}
                        >
                              <Eye size={18} /> LIVE_VIEW
                        </Link>
                  </div>

                  {/* Responsive Form Box */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(20px)', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '40px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <label style={{ color: '#0ea5e9', fontSize: '11px', fontWeight: 'bold' }}>CATEGORY_UNIT</label>
                                          <select
                                                value={formData.chapter}
                                                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                                style={{ padding: '14px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                                          >
                                                <optgroup label="Syllabus Content">
                                                      {Object.keys(categories).slice(0, 7).map(key => <option key={key} value={key}>{categories[key]}</option>)}
                                                </optgroup>
                                                <optgroup label="Additional">
                                                      {Object.keys(categories).slice(7).map(key => <option key={key} value={key}>{categories[key]}</option>)}
                                                </optgroup>
                                          </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <label style={{ color: '#0ea5e9', fontSize: '11px', fontWeight: 'bold' }}>FILE_TYPE</label>
                                          <select
                                                value={formData.fileType}
                                                onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                                                style={{ padding: '14px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                                          >
                                                {fileTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                          </select>
                                    </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: '#0ea5e9', fontSize: '11px', fontWeight: 'bold' }}>RESOURCE_TITLE</label>
                                    <input
                                          type="text" placeholder="Entry title..."
                                          value={formData.title}
                                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                          style={{ padding: '14px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                                    />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: '#0ea5e9', fontSize: '11px', fontWeight: 'bold' }}>ACCESS_URL (DRIVE/WEB)</label>
                                    <input
                                          type="text" placeholder="Paste link here..."
                                          value={formData.driveLink}
                                          onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                                          style={{ padding: '14px', backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', outline: 'none' }}
                                    />
                              </div>

                              <button
                                    onClick={saveResource}
                                    disabled={loading}
                                    style={{ padding: '16px', backgroundColor: '#0ea5e9', color: '#020617', fontWeight: '900', borderRadius: '12px', cursor: 'pointer', border: 'none', transition: '0.2s' }}
                              >
                                    {loading ? "PROCESSING..." : "SYNC_ASSET_TO_CLOUD ⬆️"}
                              </button>
                        </div>
                  </div>

                  {/* Responsive List Index */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: '#cbd5e1', marginBottom: '20px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <FileType size={18} /> ASSET_INDEX
                        </h3>

                        <div style={{ display: 'grid', gap: '12px' }}>
                              {resources.map(res => (
                                    <div key={res._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#020617', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '10px' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '200px' }}>
                                                <div style={{ color: res.chapter.length > 2 ? '#facc15' : '#0ea5e9' }}>
                                                      {res.chapter === "REF" ? <Book size={20} /> : <FileText size={20} />}
                                                </div>
                                                <div>
                                                      <h4 style={{ color: 'white', margin: 0, fontSize: '14px' }}>{res.title}</h4>
                                                      <p style={{ color: '#64748b', fontSize: '10px', margin: 0 }}>{res.chapterTitle} • {res.fileType}</p>
                                                </div>
                                          </div>
                                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <a href={res.driveLink} target="_blank" style={{ color: '#0ea5e9' }}><ExternalLink size={18} /></a>
                                                <button onClick={() => deleteResource(res._id)} style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                      <Trash2 size={18} />
                                                </button>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      );
}