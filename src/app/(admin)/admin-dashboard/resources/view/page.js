"use client";
import { useState, useEffect } from "react";
import {
      Search,
      FileText,
      Download,
      Eye,
      Monitor,
      ChevronDown,
      Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResourcePortal() {
      const categories = {
            "ALL": "ALL_RESOURCES",
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
            fetch('/api/resources')
                  .then(res => res.json())
                  .then(data => {
                        if (data.success) setResources(data.resources || []);
                        setLoading(false);
                  });
      }, []);

      const getDownloadLink = (url) => {
            if (!url) return "#";
            const match = url.match(/(?:\/d\/|id=)([\w-]+)/);
            if (match && match[1]) {
                  return `https://drive.google.com/uc?export=download&id=${match[1]}`;
            }
            return url;
      };

      const filteredResources = resources.filter(res => {
            const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "ALL" || res.chapter === selectedCategory;
            return matchesSearch && matchesCategory;
      });

      return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'var(--font-rajdhani), sans-serif', padding: 'clamp(10px, 3vw, 20px)' }}>

                  {/* Header */}
                  <div style={{ maxWidth: '1000px', margin: '0 auto 30px', textAlign: 'center' }}>
                        <h1 style={{ fontSize: 'clamp(24px, 6vw, 38px)', fontWeight: '900', color: '#0f172a', marginBottom: '5px' }}>ICT_RESOURCE_HUB</h1>
                        <p style={{ color: '#0ea5e9', fontWeight: 'bold', letterSpacing: '1px', fontSize: '11px' }}>CORE_SYSTEM_LIBRARY</p>
                  </div>

                  {/* সার্চ এবং চ্যাপ্টার ড্রপডাউন - Responsive Grid */}
                  <div style={{
                        maxWidth: '1000px',
                        margin: '0 auto 30px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '15px'
                  }}>

                        {/* Search Input */}
                        <div style={{ position: 'relative' }}>
                              <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                              <input
                                    type="text"
                                    placeholder="Search by filename..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                          width: '100%',
                                          padding: '12px 12px 12px 45px',
                                          borderRadius: '12px',
                                          border: '1px solid #e2e8f0',
                                          outline: 'none',
                                          fontSize: '14px',
                                          backgroundColor: 'white',
                                          color: '#1e293b',
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                    }}
                              />
                        </div>

                        {/* Chapter Dropdown */}
                        <div style={{ position: 'relative' }}>
                              <Filter style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#0ea5e9' }} size={18} />
                              <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{
                                          width: '100%',
                                          padding: '12px 40px 12px 45px',
                                          borderRadius: '12px',
                                          border: '1px solid #e2e8f0',
                                          outline: 'none',
                                          fontSize: '14px',
                                          backgroundColor: 'white',
                                          color: '#1e293b',
                                          cursor: 'pointer',
                                          appearance: 'none',
                                          fontWeight: 'bold',
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                    }}
                              >
                                    {Object.keys(categories).map(key => (
                                          <option key={key} value={key}>{categories[key]}</option>
                                    ))}
                              </select>
                              <ChevronDown style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} size={18} />
                        </div>
                  </div>

                  {/* Resources List - Responsive Columns */}
                  <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 310px), 1fr))',
                              gap: '20px'
                        }}>
                              <AnimatePresence>
                                    {filteredResources.map((res) => (
                                          <motion.div
                                                key={res._id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{
                                                      backgroundColor: 'white',
                                                      padding: '20px',
                                                      borderRadius: '20px',
                                                      border: '1px solid #e2e8f0',
                                                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                                      display: 'flex',
                                                      flexDirection: 'column',
                                                      justifyContent: 'space-between'
                                                }}
                                          >
                                                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                                      <div style={{ minWidth: '45px', height: '45px', backgroundColor: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                                            <FileText size={22} />
                                                      </div>
                                                      <div style={{ overflow: 'hidden' }}>
                                                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#0f172a', lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</h4>
                                                            <p style={{ margin: '3px 0 0', fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>{res.chapterTitle}</p>
                                                      </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                      <a
                                                            href={res.driveLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '10px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px' }}
                                                      >
                                                            <Eye size={14} /> VIEW
                                                      </a>
                                                      <a
                                                            href={getDownloadLink(res.driveLink)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '10px', backgroundColor: '#0ea5e9', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px' }}
                                                      >
                                                            <Download size={14} /> GET
                                                      </a>
                                                </div>
                                          </motion.div>
                                    ))}
                              </AnimatePresence>
                        </div>

                        {filteredResources.length === 0 && !loading && (
                              <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                                    <Monitor size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                                    <h4 style={{ margin: 0 }}>NOT_FOUND</h4>
                              </div>
                        )}
                  </div>
            </div>
      );
}