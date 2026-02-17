"use client";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Calendar, Eye, ChevronLeft, Image as ImageIcon, ArrowRight, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function BlogDetails({ params }) {
      const resolvedParams = use(params);
      const id = resolvedParams.id;
      const [blog, setBlog] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            if (!id) return;
            const fetchDetail = async () => {
                  try {
                        const res = await fetch(`/api/blogs/${id}`, { cache: 'no-store' });
                        const data = await res.json();
                        setBlog(data);
                  } finally { setLoading(false); }
            };
            fetchDetail();
      }, [id]);

      const getDriveImageUrl = (link) => {
            if (!link) return "/placeholder.jpg";
            const driveId = link.match(/[-\w]{25,}/);
            // সরাসরি lh3 ডোমেইন ব্যবহার করা হচ্ছে যা আমরা কনফিগারে সেট করেছি
            return driveId ? `https://lh3.googleusercontent.com/d/${driveId[0]}` : link;
      };

      if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center font-black text-blue-500 tracking-[0.5em]">SYNCING_PROTOCOL...</div>;
      if (!blog) return <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">SIGNAL_LOST_404</div>;

      return (
            <main className="min-h-screen bg-[#020617] text-white relative">
                  <ParticlesBackground />
                  <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4 px-6">
                        <div className="max-w-5xl mx-auto flex justify-between items-center">
                              <Link href="/blogs" className="flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition">
                                    <ChevronLeft size={20} /> ARCHIVE_BACK
                              </Link>
                              <Share2 size={20} className="text-gray-500 cursor-pointer hover:text-white transition" />
                        </div>
                  </nav>

                  <article className="max-w-4xl mx-auto pt-32 pb-20 px-6 relative z-10">
                        <header className="mb-12">
                              <div className="flex items-center gap-4 mb-6">
                                    {blog.category && <span className="bg-blue-600 text-[10px] px-3 py-1 rounded-md font-black uppercase">{blog.category}</span>}
                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                          <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString('en-GB')}
                                    </span>
                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                          <Eye size={14} /> {blog.views} VIEWS
                                    </span>
                              </div>
                              <h1 className="text-4xl md:text-7xl font-black leading-tight mb-10 italic tracking-tighter">{blog.title}</h1>
                              <div className="relative h-[300px] md:h-[550px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                                    <Image src={getDriveImageUrl(blog.thumbnail)} alt={blog.title} fill className="object-cover" priority />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div>
                              </div>
                        </header>

                        <section className="prose prose-invert max-w-none mb-20">
                              <div className="text-gray-300 text-lg md:text-2xl leading-relaxed whitespace-pre-wrap font-rajdhani">
                                    {blog.content}
                              </div>
                        </section>

                        {/* Satellite Assets (Multiple Images) */}
                        {blog.additionalImages && blog.additionalImages.filter(img => img.trim() !== "").length > 0 && (
                              <section className="mt-20 border-t border-white/5 pt-16">
                                    <div className="flex items-center gap-3 mb-10 text-blue-500">
                                          <ImageIcon size={24} />
                                          <h3 className="text-2xl font-black italic uppercase">Satellite_Assets</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                          {blog.additionalImages.filter(img => img.trim() !== "").map((img, index) => (
                                                <motion.div key={index} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="relative h-80 rounded-[2.5rem] overflow-hidden border border-white/10">
                                                      <Image src={getDriveImageUrl(img)} alt={`Asset ${index}`} fill className="object-cover hover:scale-110 transition duration-700" />
                                                </motion.div>
                                          ))}
                                    </div>
                              </section>
                        )}

                        <footer className="mt-20 p-10 rounded-[3rem] bg-slate-900/40 border border-white/5 text-center">
                              <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] mb-6">EndOfTransmission</p>
                              <Link href="/blogs" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-black shadow-xl transition-all active:scale-95">
                                    DISCONNECT_READER <ArrowRight size={20} />
                              </Link>
                        </footer>
                  </article>
            </main>
      );
}