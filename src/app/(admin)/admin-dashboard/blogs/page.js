"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Loader2, Image as ImageIcon, X, Save, AlertTriangle, CheckCircle2, Archive, Globe, Eye } from "lucide-react";

export default function ManageBlogs() {
      const [blogs, setBlogs] = useState([]);
      const [loading, setLoading] = useState(true);
      const [actionLoading, setActionLoading] = useState(false);
      const [showForm, setShowForm] = useState(false);
      const [editingId, setEditingId] = useState(null);
      const [signal, setSignal] = useState({ show: false, msg: "", type: "info" });
      const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

      const [formData, setFormData] = useState({
            title: "",
            category: "",
            content: "",
            thumbnail: "",
            additionalImages: [""],
            status: "published"
      });

      useEffect(() => { fetchBlogs(); }, []);

      const showSignal = (msg, type = "success") => {
            setSignal({ show: true, msg, type });
            setTimeout(() => setSignal({ show: false, msg: "", type: "info" }), 3000);
      };

      const fetchBlogs = async () => {
            try {
                  const res = await fetch("/api/blogs?admin=true", { cache: 'no-store' });
                  const data = await res.json();
                  setBlogs(data.blogs || []);
            } finally { setLoading(false); }
      };

      const toggleStatus = async (blog) => {
            const newStatus = blog.status === "archived" ? "published" : "archived";
            setActionLoading(true);
            try {
                  const res = await fetch(`/api/blogs/${blog._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: newStatus }),
                  });
                  if (res.ok) {
                        showSignal(newStatus === "archived" ? "ARCHIVED" : "RESTORED");
                        await fetchBlogs();
                  }
            } catch (e) { showSignal("ERROR", "error"); }
            finally { setActionLoading(false); }
      };

      const deletePermanent = async () => {
            setActionLoading(true);
            try {
                  const res = await fetch(`/api/blogs/${deleteModal.id}`, { method: "DELETE" });
                  if (res.ok) {
                        setBlogs(blogs.filter(b => b._id !== deleteModal.id));
                        showSignal("WIPED", "error");
                  } else { showSignal("SERVER_ERROR", "error"); }
            } catch (e) { showSignal("FAILED", "error"); }
            finally {
                  setActionLoading(false);
                  setDeleteModal({ show: false, id: null });
            }
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setActionLoading(true);

            // খালি ইনপুটগুলো বাদ দিয়ে ডাটা ক্লিন করা হচ্ছে
            const cleanedImages = formData.additionalImages.filter(img => img && img.trim() !== "");
            const finalData = {
                  ...formData,
                  additionalImages: cleanedImages
            };

            const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
            try {
                  const res = await fetch(url, {
                        method: editingId ? "PUT" : "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(finalData),
                  });
                  if (res.ok) {
                        showSignal("SUCCESS");
                        resetForm();
                        fetchBlogs();
                  }
            } finally { setActionLoading(false); }
      };

      const resetForm = () => {
            setFormData({ title: "", category: "", content: "", thumbnail: "", additionalImages: [""], status: "published" });
            setEditingId(null);
            setShowForm(false);
      };

      const handleEditStart = (blog) => {
            setEditingId(blog._id);
            setFormData({
                  title: blog.title || "",
                  category: blog.category || "",
                  content: blog.content || "",
                  thumbnail: blog.thumbnail || "",
                  // এডিট মোডেও সেফটি চেক
                  additionalImages: (blog.additionalImages && blog.additionalImages.length > 0) ? blog.additionalImages : [""],
                  status: blog.status || "published"
            });
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      return (
            <div style={{ color: "white", fontFamily: 'var(--font-rajdhani)' }}>
                  {/* Notification */}
                  <AnimatePresence>
                        {signal.show && (
                              <motion.div initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: 100 }} style={{ position: "fixed", top: "100px", right: "20px", zIndex: 1100, backgroundColor: signal.type === "error" ? "#f43f5e" : "#10b981", padding: "15px 25px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                                    {signal.type === "error" ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                                    <span style={{ fontWeight: "900" }}>{signal.msg}</span>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  {/* Delete Modal */}
                  <AnimatePresence>
                        {deleteModal.show && (
                              <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(2, 6, 23, 0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
                                    <div style={{ backgroundColor: "#0f172a", border: "2px solid #f43f5e", borderRadius: "24px", padding: "35px", maxWidth: "400px", textAlign: "center" }}>
                                          <AlertTriangle size={50} color="#f43f5e" style={{ margin: "0 auto 20px" }} />
                                          <h3 style={{ fontWeight: "900" }}>PERMANENT_WIPE?</h3>
                                          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                                                <button onClick={() => setDeleteModal({ show: false, id: null })} style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "transparent", color: "white", cursor: "pointer", border: "1px solid #334155" }}>CANCEL</button>
                                                <button onClick={deletePermanent} style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "#f43f5e", border: "none", color: "white", fontWeight: "900", cursor: "pointer" }}>WIPE</button>
                                          </div>
                                    </div>
                              </div>
                        )}
                  </AnimatePresence>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", alignItems: "center" }}>
                        <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#38bdf8" }}>PULSE_OS</h2>
                        <button onClick={() => { if (showForm) resetForm(); else setShowForm(true); }} style={{ backgroundColor: showForm ? "#f43f5e" : "#3b82f6", color: "white", border: "none", padding: "12px 25px", borderRadius: "12px", fontWeight: "900", cursor: "pointer" }}>
                              {showForm ? "ABORT" : "NEW_SIGNAL"}
                        </button>
                  </div>

                  {/* Form */}
                  <AnimatePresence>
                        {showForm && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ backgroundColor: "#0f172a", padding: "30px", borderRadius: "24px", border: "2px solid #1e293b", marginBottom: "40px", overflow: "hidden" }}>
                                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
                                          <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: "100%", padding: "15px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "12px", color: "white", outline: "none" }} placeholder="Transmission Title..." />
                                          <input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: "100%", padding: "15px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "12px", color: "#38bdf8", outline: "none" }} placeholder="Category..." />
                                          <input required value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} style={{ width: "100%", padding: "15px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "12px", color: "#10b981", outline: "none" }} placeholder="Main Banner Drive Link..." />

                                          <div style={{ backgroundColor: "#020617", padding: "20px", borderRadius: "15px", border: "1px dashed #334155" }}>
                                                <p style={{ fontSize: "11px", color: "#a855f7", marginBottom: "10px", fontWeight: "800" }}>ADDITIONAL_ASSETS</p>
                                                {formData.additionalImages?.map((img, i) => (
                                                      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                                            <input value={img} onChange={(e) => {
                                                                  const newImgs = [...formData.additionalImages];
                                                                  newImgs[i] = e.target.value;
                                                                  setFormData({ ...formData, additionalImages: newImgs });
                                                            }} style={{ flex: 1, padding: "12px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#94a3b8", outline: "none" }} placeholder="Drive Link..." />
                                                            {formData.additionalImages.length > 1 && (
                                                                  <button type="button" onClick={() => setFormData({ ...formData, additionalImages: formData.additionalImages.filter((_, idx) => idx !== i) })} style={{ color: "#f43f5e", background: "none", border: "none", cursor: "pointer" }}><X /></button>
                                                            )}
                                                      </div>
                                                ))}
                                                <button type="button" onClick={() => setFormData({ ...formData, additionalImages: [...(formData.additionalImages || []), ""] })} style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "800" }}>+ ATTACH_NEW_FIELD</button>
                                          </div>

                                          <textarea required value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} style={{ width: "100%", height: "150px", padding: "15px", backgroundColor: "#020617", border: "1px solid #334155", borderRadius: "12px", color: "white", resize: "none", outline: "none" }} placeholder="Transmission Content..." />
                                          <button type="submit" disabled={actionLoading} style={{ backgroundColor: "#10b981", color: "#020617", padding: "18px", borderRadius: "12px", fontWeight: "900", cursor: "pointer", border: "none" }}>
                                                {actionLoading ? <Loader2 className="animate-spin mx-auto" /> : editingId ? "SYNC_OVERWRITE" : "EXECUTE_TRANSMISSION"}
                                          </button>
                                    </form>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  {/* Blog List Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "25px" }}>
                        {blogs.map((blog) => (
                              <motion.div layout key={blog._id} style={{ backgroundColor: "#0f172a", border: `2px solid ${blog.status === 'archived' ? '#f43f5e30' : '#1e293b'}`, borderRadius: "24px", overflow: "hidden", opacity: blog.status === 'archived' ? 0.6 : 1, display: "flex", flexDirection: "column" }}>
                                    <div style={{ padding: "25px" }}>
                                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: "900", backgroundColor: "#38bdf810", padding: "4px 8px", borderRadius: "5px" }}>{blog.category ? blog.category.toUpperCase() : "NO_CATEGORY"}</span>
                                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: blog.status === 'published' ? "#10b981" : "#f59e0b" }}></div>
                                                      <span style={{ fontSize: "10px", fontWeight: "900", color: "#94a3b8" }}>{blog.status?.toUpperCase()}</span>
                                                </div>
                                          </div>
                                          <h3 style={{ fontSize: "20px", fontWeight: "900", color: "white", marginTop: "15px", lineHeight: "1.3" }}>{blog.title}</h3>

                                          {/* Asset and View Count (DYNAMIC) */}
                                          <div style={{ marginTop: "15px", display: "flex", gap: "10px", color: "#64748b", fontSize: "11px", fontWeight: "800" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                      <ImageIcon size={14} />
                                                      {/* ডাটাবেসে থাকলে কাউন্ট দেখাবে, না থাকলে ০ */}
                                                      {(blog.additionalImages && Array.isArray(blog.additionalImages)) ? blog.additionalImages.length : 0} Assets
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "10px" }}>
                                                      <Eye size={14} />
                                                      {/* views না থাকলে ০ দেখাবে */}
                                                      {blog.views || 0} Views
                                                </div>
                                          </div>
                                    </div>
                                    <div style={{ display: "flex", borderTop: "1px solid #1e293b", background: "#1e293b40", marginTop: "auto" }}>
                                          <button onClick={() => toggleStatus(blog)} style={{ flex: 1, padding: "18px", border: "none", background: "none", color: blog.status === 'archived' ? "#10b981" : "#f59e0b", cursor: "pointer", borderRight: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {blog.status === 'archived' ? <Globe size={22} /> : <Archive size={22} />}
                                          </button>
                                          <button onClick={() => handleEditStart(blog)} style={{ flex: 1, padding: "18px", border: "none", background: "none", color: "#38bdf8", cursor: "pointer", borderRight: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={22} /></button>
                                          <button onClick={() => setDeleteModal({ show: true, id: blog._id })} style={{ flex: 1, padding: "18px", border: "none", background: "none", color: "#f43f5e", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={22} /></button>
                                    </div>
                              </motion.div>
                        ))}
                  </div>
            </div>
      );
}