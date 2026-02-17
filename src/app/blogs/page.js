"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, ArrowLeft, Eye, Calendar } from "lucide-react";
import Link from "next/link";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function BlogArchive() {
      const [blogs, setBlogs] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const fetchAllBlogs = async () => {
                  try {
                        const res = await fetch("/api/blogs", { cache: 'no-store' });
                        const data = await res.json();
                        setBlogs(data.blogs || []);
                  } finally {
                        setLoading(false);
                  }
            };
            fetchAllBlogs();
      }, []);

      const getDriveImageUrl = (link) => {
            if (!link) return "/placeholder.jpg";
            const id = link.match(/[-\w]{25,}/);
            return id ? `https://lh3.googleusercontent.com/u/0/d/${id[0]}` : link;
      };

      return (
            <main className="min-h-screen bg-[#020617] text-white relative py-20 px-6">
                  <ParticlesBackground />
                  <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex items-center justify-between mb-16">
                              <div className="flex items-center gap-4">
                                    <Newspaper size={40} className="text-blue-500" />
                                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Signal_Archive</h1>
                              </div>
                              <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 font-bold transition">
                                    <ArrowLeft size={20} /> RETURN_TO_HUB
                              </Link>
                        </div>

                        {loading ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-900 animate-pulse rounded-[2rem] border border-white/5" />)}
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {blogs.map((blog) => (
                                          <Link key={blog._id} href={`/blogs/${blog._id}`}>
                                                <motion.div whileHover={{ y: -10 }} className="group relative overflow-hidden rounded-[2.5rem] h-[28rem] bg-slate-900 border border-white/10 cursor-pointer">
                                                      <div className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${getDriveImageUrl(blog.thumbnail)})` }} />
                                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                                                      <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                  {blog.category && <span className="bg-blue-600 text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest">{blog.category}</span>}
                                                                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Eye size={12} /> {blog.views}</span>
                                                            </div>
                                                            <h3 className="text-2xl font-black mb-3 group-hover:text-blue-400 transition">{blog.title}</h3>
                                                            <p className="text-sm text-gray-400 line-clamp-2">{blog.content.substring(0, 100)}...</p>
                                                      </div>
                                                </motion.div>
                                          </Link>
                                    ))}
                              </div>
                        )}
                  </div>
            </main>
      );
}