"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
      Search, FileText, Download, Eye, ChevronDown,
      Filter, Box, ArrowLeft, Sparkles, BookOpen,
      Database, ShieldCheck, Zap
} from "lucide-react";
import Link from "next/link";

export default function ResourcePortal() {
      const categoriesMap = {
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
            fetch('/api/resources')
                  .then(res => res.json())
                  .then(data => {
                        if (data.success) {
                              setResources(data.resources || []);
                        }
                        setLoading(false);
                  })
                  .catch(() => setLoading(false));
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

      if (loading) return (
            <div className="h-screen bg-[#020617] flex flex-col items-center justify-center font-black text-blue-500 uppercase tracking-widest text-xs gap-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                        <Zap size={40} />
                  </motion.div>
                  CONNECTING_TO_ARCHIVE...
            </div>
      );

      return (
            <div className="min-h-screen bg-[#020617] text-[#f8fafc] p-4 md:p-10 pb-32">
                  <div className="max-w-7xl mx-auto space-y-10">

                        <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
                              <div className="space-y-4 w-full">
                                    <Link href="/student-dashboard" className="w-fit flex items-center gap-2 text-blue-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest bg-white/5 px-5 py-2.5 rounded-full border border-white/5">
                                          <ArrowLeft size={14} /> System_Back
                                    </Link>
                                    <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                                          THE <span className="text-blue-500">VAULT</span>
                                    </h1>
                              </div>
                              <div className="hidden lg:grid grid-cols-2 gap-4 w-full max-w-sm">
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                                          <p className="text-[8px] font-black text-blue-500 uppercase mb-1">Total_Assets</p>
                                          <p className="text-2xl font-black">{resources.length}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                                          <p className="text-[8px] font-black text-emerald-500 uppercase mb-1">Status</p>
                                          <p className="text-2xl font-black italic text-emerald-400 uppercase">Online</p>
                                    </div>
                              </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-[2.5rem] border border-white/5 backdrop-blur-xl sticky top-4 z-[100] shadow-2xl">
                              <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                                    <input
                                          type="text"
                                          placeholder="SEARCH_INDEX..."
                                          value={searchQuery}
                                          onChange={(e) => setSearchQuery(e.target.value)}
                                          className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 uppercase tracking-widest"
                                    />
                              </div>

                              <div className="relative">
                                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                                    <select
                                          value={selectedCategory}
                                          onChange={(e) => setSelectedCategory(e.target.value)}
                                          className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 pl-14 pr-10 text-[10px] font-black text-white focus:border-blue-500 outline-none appearance-none cursor-pointer uppercase tracking-widest"
                                    >
                                          {Object.keys(categoriesMap).map(key => (
                                                <option key={key} value={key} className="bg-[#020617] font-bold">
                                                      {categoriesMap[key]}
                                                </option>
                                          ))}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
                              </div>
                        </div>

                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <AnimatePresence mode="popLayout">
                                    {filteredResources.map((res, idx) => (
                                          <motion.div
                                                key={res._id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="group relative bg-[#0f172a]/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/5 flex flex-col justify-between hover:border-blue-500/40 hover:bg-blue-600/[0.03] transition-all duration-500 overflow-hidden"
                                          >
                                                <div>
                                                      <div className="flex justify-between items-start mb-8">
                                                            <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                                  <FileText size={32} />
                                                            </div>
                                                            <div className="text-right">
                                                                  <p className="text-[7px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1">Index_0{idx + 1}</p>
                                                                  <span className="text-[9px] font-black uppercase px-3 py-1 bg-white/5 text-white rounded-lg border border-white/10">
                                                                        {res.fileType || "PDF"}
                                                                  </span>
                                                            </div>
                                                      </div>

                                                      <h4 className="text-white font-black text-xl uppercase leading-tight mb-4 tracking-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                                                            {res.title}
                                                      </h4>

                                                      <div className="inline-flex items-center gap-2 bg-blue-500/5 px-3 py-1.5 rounded-full border border-blue-500/10 mb-6">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                                            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">
                                                                  {categoriesMap[res.chapter] || "Master Library"}
                                                            </p>
                                                      </div>

                                                      {res.description && (
                                                            <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3 font-medium mb-8 italic">
                                                                  "{res.description}"
                                                            </p>
                                                      )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                      <a
                                                            href={res.driveLink}
                                                            target="_blank"
                                                            rel="noopener"
                                                            className="flex items-center justify-center gap-2 py-4 bg-white/5 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 active:scale-95"
                                                      >
                                                            <Eye size={16} /> Preview
                                                      </a>
                                                      <a
                                                            href={getDownloadLink(res.driveLink)}
                                                            target="_blank"
                                                            rel="noopener"
                                                            className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                                                      >
                                                            <Download size={16} /> Get File
                                                      </a>
                                                </div>
                                          </motion.div>
                                    ))}
                              </AnimatePresence>
                        </motion.div>

                        {filteredResources.length === 0 && !loading && (
                              <div className="py-40 text-center flex flex-col items-center gap-6">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/5 text-gray-800">
                                          <Database size={48} />
                                    </motion.div>
                                    <div className="space-y-2">
                                          <h3 className="text-gray-500 font-black uppercase text-xs tracking-[0.5em]">No_Matching_Entries</h3>
                                          <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">Query returned zero results from central mainframe</p>
                                    </div>
                              </div>
                        )}
                  </div>
            </div>
      );
}