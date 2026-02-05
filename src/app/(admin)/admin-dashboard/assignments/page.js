"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
      PlusCircle, History, Trash2, Edit3,
      Calendar, Clock, Eye, X, CheckCircle2, ListOrdered, Info, Loader2, Save, XCircle, AlertTriangle, Link as LinkIcon
} from "lucide-react";
import Link from "next/link";

export default function AssignmentAdmin() {
      const [assignments, setAssignments] = useState([]);
      const [loading, setLoading] = useState(false);
      const [isEditing, setIsEditing] = useState(null);
      const [previewItem, setPreviewItem] = useState(null);
      const [toast, setToast] = useState(null);
      const [confirmDelete, setConfirmDelete] = useState(null);

      const [formData, setFormData] = useState({
            title: "", description: "", attachment: "", deadline: ""
      });

      const showToast = (msg, type = "success") => {
            setToast({ msg, type });
            setTimeout(() => setToast(null), 4000);
      };

      const fetchHistory = async () => {
            try {
                  const res = await fetch('/api/assignments');
                  const data = await res.json();
                  if (data.success) setAssignments(data.assignments);
            } catch (e) { console.error("Sync Error"); }
      };

      useEffect(() => { fetchHistory(); }, []);

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            const method = isEditing ? 'PUT' : 'POST';
            const payload = isEditing ? { ...formData, id: isEditing } : formData;

            try {
                  const res = await fetch('/api/assignments', {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                  });
                  const data = await res.json();
                  if (data.success) {
                        showToast(isEditing ? "ASSIGNMENT_UPDATED_SYNCED" : "NEW_ASSIGNMENT_POSTED", "success");
                        setFormData({ title: "", description: "", attachment: "", deadline: "" });
                        setIsEditing(null);
                        fetchHistory();
                  }
            } catch (error) { showToast("TRANSMISSION_ERROR", "error"); }
            finally { setLoading(false); }
      };

      const processDelete = async () => {
            if (!confirmDelete) return;
            try {
                  const res = await fetch(`/api/assignments?id=${confirmDelete}`, { method: 'DELETE' });
                  const data = await res.json();
                  if (data.success) {
                        showToast("ASSIGNMENT_PURGED_SUCCESSFULLY", "success");
                        fetchHistory();
                  }
            } catch (e) { showToast("PURGE_FAILED", "error"); }
            finally { setConfirmDelete(null); }
      };

      const startEdit = (item) => {
            setIsEditing(item._id);
            setFormData({
                  title: item.title,
                  description: item.description,
                  attachment: item.attachment,
                  deadline: new Date(item.deadline).toISOString().slice(0, 16)
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 10px 100px', fontFamily: 'var(--font-rajdhani), sans-serif', backgroundColor: '#fdfdfd' }}>

                  <AnimatePresence>
                        {toast && (
                              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}
                                    style={{ position: 'fixed', top: '30px', right: '30px', zIndex: 10000, backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444", color: 'white', padding: '18px 25px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                                    {toast.type === "success" ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                                    <span style={{ fontWeight: '800', fontSize: '14px' }}>{toast.msg}</span>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  <AnimatePresence>
                        {confirmDelete && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                          style={{ backgroundColor: 'white', padding: '40px', borderRadius: '25px', maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                                          <AlertTriangle size={50} color="#ef4444" style={{ marginBottom: '15px', marginLeft: 'auto', marginRight: 'auto' }} />
                                          <h3 style={{ color: '#1e293b', fontWeight: '900', margin: '0 0 10px' }}>CONFIRM_DELETE</h3>
                                          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px' }}>Are you sure you want to permanently erase this assignment node?</p>
                                          <div style={{ display: 'flex', gap: '15px' }}>
                                                <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: 'none', color: '#64748b', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
                                                <button onClick={processDelete} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#ef4444', color: 'white', fontWeight: '900', cursor: 'pointer' }}>ERASE_NOW</button>
                                          </div>
                                    </motion.div>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                              <h2 style={{ color: '#0f172a', fontWeight: '900', fontSize: 'clamp(22px, 4vw, 32px)', display: 'flex', alignItems: 'center', gap: '15px', margin: 0 }}>
                                    <PlusCircle size={30} color="#0ea5e9" /> {isEditing ? "EDIT_ASSIGNMENT" : "NEW_ASSIGNMENT"}
                              </h2>
                              <p style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: '900', letterSpacing: '2px', marginTop: '5px' }}>TASK_MANAGEMENT_STATION</p>
                        </div>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '10px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '900', fontSize: '14px' }}>
                              TOTAL: {assignments.length}
                        </div>
                  </div>

                  <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '30px', border: '1px solid #e2e8f0', marginBottom: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '900', marginLeft: '5px' }}>ASSIGNMENT_TITLE</label>
                                    <input type="text" placeholder="Enter assignment title..." value={formData.title} required onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                          style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', fontWeight: '700', fontSize: '15px' }} />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '900', marginLeft: '5px' }}>INSTRUCTION_LOG</label>
                                    <textarea rows="5" placeholder="Define submission rules and instructions..." value={formData.description} required onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                          style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', outline: 'none', fontWeight: '600', fontSize: '15px', resize: 'vertical' }} />
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '900', marginLeft: '5px' }}>ATTACHMENT_LINK (DRIVE)</label>
                                          <div style={{ position: 'relative' }}>
                                                <LinkIcon size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                                <input type="text" placeholder="https://drive.google.com/..." value={formData.attachment} onChange={(e) => setFormData({ ...formData, attachment: e.target.value })}
                                                      style={{ width: '100%', padding: '16px 16px 16px 45px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0ea5e9', outline: 'none', fontWeight: '600' }} />
                                          </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <label style={{ fontSize: '11px', color: '#ef4444', fontWeight: '900', marginLeft: '5px' }}>SUBMISSION_DEADLINE</label>
                                          <div style={{ position: 'relative' }}>
                                                <Clock size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} />
                                                <input type="datetime-local" value={formData.deadline} required onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                      style={{ width: '100%', padding: '16px 16px 16px 45px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: '700', outline: 'none' }} />
                                          </div>
                                    </div>
                              </div>

                              <button type="submit" disabled={loading} style={{ padding: '18px', backgroundColor: isEditing ? '#f59e0b' : '#0ea5e9', color: 'white', fontWeight: '900', borderRadius: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>
                                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {loading ? "SYNCHRONIZING..." : isEditing ? "UPDATE_ASSIGNMENT" : "POST_ASSIGNMENT"}
                              </button>
                        </div>
                  </form>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', paddingLeft: '5px' }}>
                        <History size={24} color="#0ea5e9" />
                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', margin: 0 }}>TASK_HISTORY_ARCHIVE</h3>
                  </div>

                  <div style={{ display: 'grid', gap: '20px' }}>
                        {assignments.map((item, index) => (
                              <div key={item._id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', transition: '0.2s' }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1, minWidth: '300px' }}>
                                          <div style={{ backgroundColor: '#f1f5f9', color: '#0ea5e9', minWidth: '45px', height: '45px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', border: '1px solid #e2e8f0' }}>{index + 1}</div>
                                          <div>
                                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#1e293b' }}>{item.title}</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '8px' }}>
                                                      <span style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}><Calendar size={14} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                                      <span style={{ fontSize: '13px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}><Clock size={14} /> DEADLINE: {new Date(item.deadline).toLocaleString()}</span>
                                                </div>
                                          </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                          <button onClick={() => setPreviewItem(item)} style={{ padding: '12px', color: '#0ea5e9', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', cursor: 'pointer' }}><Eye size={20} /></button>
                                          <Link href={`/admin-dashboard/assignments/submissions/${item._id}`} style={{ padding: '12px', color: '#10b981', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px' }}><CheckCircle2 size={20} /></Link>
                                          <button onClick={() => startEdit(item)} style={{ padding: '12px', color: '#f59e0b', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', cursor: 'pointer' }}><Edit3 size={20} /></button>
                                          <button onClick={() => setConfirmDelete(item._id)} style={{ padding: '12px', color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', cursor: 'pointer' }}><Trash2 size={20} /></button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  <AnimatePresence>
                        {previewItem && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
                                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                          style={{ backgroundColor: 'white', width: '100%', maxWidth: '700px', borderRadius: '35px', padding: '40px', position: 'relative', border: '1px solid #e2e8f0', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                                          <button onClick={() => setPreviewItem(null)} style={{ position: 'absolute', right: '25px', top: '25px', background: '#f1f5f9', border: 'none', borderRadius: '12px', padding: '8px', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
                                          <h3 style={{ color: '#0ea5e9', margin: '0 0 25px 0', fontSize: '24px', fontWeight: '900' }}>{previewItem.title}</h3>
                                          <div style={{ whiteSpace: 'pre-wrap', color: '#475569', fontSize: '16px', lineHeight: '1.8', backgroundColor: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>{previewItem.description}</div>
                                          {previewItem.attachment && (
                                                <a href={previewItem.attachment} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '30px', padding: '12px 25px', backgroundColor: '#0ea5e9', color: 'white', fontWeight: '900', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.3)' }}>
                                                      <Eye size={18} /> VIEW_ATTACHMENT
                                                </a>
                                          )}
                                    </motion.div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
}