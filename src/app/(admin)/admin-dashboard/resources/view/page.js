"use client";
import { useState, useEffect } from "react";
import {
      Search, FileText, Download, Eye, Monitor, ChevronDown, Filter, Layers, Box
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResourcePortal() {
      const categories = {
            "ALL": "--- MASTER_LIBRARY ---",
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

      const [resources, setResources] = useState([]);
      const [selectedCategory, setSelectedCategory] = useState("ALL");
      const [searchQuery, setSearchQuery] = useState("");
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            fetch('/api/resources').then(res => res.json()).then(data => {
                  if (data.success) setResources(data.resources || []);
                  setLoading(false);
            });
      }, []);

      const getDownloadLink = (url) => {
            if (!url) return "#";
            const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
            if (match && match[1]) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
            return url;
      };

      const filteredResources = resources.filter(res => {
            const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "ALL" || res.chapter === selectedCategory;
            return matchesSearch && matchesCategory;
      });

      return (
            <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'var(--font-rajdhani), sans-serif', padding: 'clamp(20px, 5vw, 40px)' }}>

                  <div style={{ maxWidth: '1200px', margin: '0 auto 50px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: 'clamp(32px, 7vw, 48px)', fontWeight: '900', color: 'white', letterSpacing: '3px', margin: 0 }}>RESOURCE_PORTAL</h1>
                        <p style={{ color: '#0ea5e9', fontWeight: 'bold', letterSpacing: '4px', fontSize: '12px', marginTop: '5px' }}>ACCESS_RESTRICTED_ICT_ASSETS</p>
                  </div>

                  <div style={{ maxWidth: '1200px', margin: '0 auto 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                              <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9' }} size={20} />
                              <input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '15px', backgroundColor: '#0f172a', border: '2px solid #1e293b', color: 'white', outline: 'none', fontWeight: '700' }} />
                        </div>

                        <div style={{ position: 'relative' }}>
                              <Filter style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9' }} size={20} />
                              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{ width: '100%', padding: '18px 20px 18px 55px', borderRadius: '15px', backgroundColor: '#0f172a', border: '2px solid #1e293b', color: 'white', fontWeight: '800', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                                    {Object.keys(categories).map(key => <option key={key} value={key}>{categories[key]}</option>)}
                              </select>
                              <ChevronDown style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                        </div>
                  </div>

                  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '25px' }}>
                              <AnimatePresence>
                                    {filteredResources.map((res) => (
                                          <motion.div key={res._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                                style={{ backgroundColor: '#0f172a', padding: '25px', borderRadius: '30px', border: '1px solid #1e293b', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <div>
                                                      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                                                            <div style={{ minWidth: '55px', height: '55px', backgroundColor: '#020617', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', border: '1px solid #1e293b' }}>
                                                                  <FileText size={28} />
                                                            </div>
                                                            <div style={{ overflow: 'hidden' }}>
                                                                  <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</h4>
                                                                  <p style={{ margin: '5px 0 0', fontSize: '11px', fontWeight: '800', color: '#64748b' }}>{res.chapterTitle}</p>
                                                                  <span style={{ display: 'inline-block', marginTop: '8px', padding: '3px 10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '6px', fontSize: '10px', fontWeight: '900' }}>{res.fileType}</span>
                                                            </div>
                                                      </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px' }}>
                                                      <a href={res.driveLink} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#1e293b', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '12px' }}>
                                                            <Eye size={16} /> VIEW
                                                      </a>
                                                      <a href={getDownloadLink(res.driveLink)} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#0ea5e9', color: '#020617', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '12px' }}>
                                                            <Download size={16} /> DOWNLOAD
                                                      </a>
                                                </div>
                                          </motion.div>
                                    ))}
                              </AnimatePresence>
                        </div>

                        {filteredResources.length === 0 && !loading && (
                              <div style={{ textAlign: 'center', padding: '100px 0', color: '#475569' }}>
                                    <Box size={80} style={{ opacity: 0.1, marginBottom: '20px' }} />
                                    <h3 style={{ fontWeight: '900', letterSpacing: '2px' }}>DATABASE_EMPTY_OR_NOT_FOUND</h3>
                              </div>
                        )}
                  </div>
            </div>
      );
}