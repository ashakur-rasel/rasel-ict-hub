"use client";
import { useState, useEffect } from "react";
import {
      PlusCircle, History, Trash2, Edit3,
      Calendar, Clock, Eye, X, CheckCircle, ListOrdered, Info
} from "lucide-react";
import Link from "next/link";

export default function AssignmentAdmin() {
      const [assignments, setAssignments] = useState([]);
      const [loading, setLoading] = useState(false);
      const [isEditing, setIsEditing] = useState(null);
      const [previewItem, setPreviewItem] = useState(null);
      const [toast, setToast] = useState(null); // Custom Notification State

      const [formData, setFormData] = useState({
            title: "", description: "", attachment: "", deadline: ""
      });

      // শো নোটিফিকেশন ফাংশন
      const showToast = (msg) => {
            setToast(msg);
            setTimeout(() => setToast(null), 3000);
      };

      const fetchHistory = async () => {
            const res = await fetch('/api/assignments');
            const data = await res.json();
            if (data.success) setAssignments(data.assignments);
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
                        showToast(isEditing ? "Assignment Updated! 📝" : "Assignment Posted! 🚀");
                        setFormData({ title: "", description: "", attachment: "", deadline: "" });
                        setIsEditing(null);
                        fetchHistory();
                  }
            } catch (error) { showToast("Action Failed! ❌"); }
            finally { setLoading(false); }
      };

      const deleteAssignment = async (id) => {
            if (!confirm("Are you sure?")) return;
            const res = await fetch(`/api/assignments?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                  showToast("Deleted Successfully! 🗑️");
                  fetchHistory();
            }
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
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '15px', paddingBottom: '100px', fontFamily: 'var(--font-rajdhani), sans-serif' }}>

                  {/* Custom Toast Notification */}
                  {toast && (
                        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#0f172a', color: 'white', padding: '15px 25px', borderRadius: '12px', zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', borderLeft: '4px solid #0ea5e9', fontWeight: 'bold', animation: 'slideIn 0.3s ease-out' }}>
                              {toast}
                        </div>
                  )}

                  <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ color: '#0ea5e9', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', margin: 0 }}>
                              <PlusCircle /> {isEditing ? "EDIT_MODE" : "NEW_ASSIGNMENT"}
                        </h2>
                        <div style={{ backgroundColor: '#f1f5f9', padding: '5px 15px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>
                              TOTAL: {assignments.length}
                        </div>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <input
                                    type="text" placeholder="Assignment Title"
                                    value={formData.title} required
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', color: '#1e293b', outline: 'none' }}
                              />
                              <textarea
                                    rows="5" placeholder="Rules and details..."
                                    value={formData.description} required
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#1e293b', resize: 'vertical', outline: 'none' }}
                              />
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                                    <input type="text" placeholder="Drive Link" value={formData.attachment} onChange={(e) => setFormData({ ...formData, attachment: e.target.value })} style={{ padding: '14px', color: '#1e293b', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                    <input type="datetime-local" placeholder="Deadline" value={formData.deadline} required onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} style={{ padding: '14px', color: '#1e293b', borderRadius: '12px', border: '1px solid #ffffff', outline: 'none' }} />
                              </div>
                              <button type="submit" disabled={loading} style={{ padding: '16px', backgroundColor: isEditing ? '#f59e0b' : '#0ea5e9', color: 'white', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                                    {loading ? "DATA_SYNCING..." : isEditing ? "UPDATE_ASSIGNMENT" : "POST_ASSIGNMENT 🚀"}
                              </button>
                              {isEditing && <button type="button" onClick={() => { setIsEditing(null); setFormData({ title: "", description: "", attachment: "", deadline: "" }) }} style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel Edit</button>}
                        </div>
                  </form>

                  <h3 style={{ fontSize: '18px', color: '#77adff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <History size={22} /> ASSIGNMENT_HISTORY
                  </h3>

                  {/* History List */}
                  <div style={{ display: 'grid', gap: '15px' }}>
                        {assignments.map((item, index) => (
                              <div key={item._id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1, minWidth: '250px' }}>
                                          <div style={{ backgroundColor: '#0ea5e9', color: 'white', minWidth: '35px', height: '35px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px' }}>
                                                {index + 1}
                                          </div>
                                          <div>
                                                <h4 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>{item.title}</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '8px' }}>
                                                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <PlusCircle size={12} /> Created: {new Date(item.createdAt).toLocaleDateString()}
                                                      </p>
                                                      <p style={{ margin: 0, fontSize: '11px', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                                                            <Clock size={12} /> Due: {new Date(item.deadline).toLocaleString()}
                                                      </p>
                                                </div>
                                          </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                          <button onClick={() => setPreviewItem(item)} style={{ padding: '10px', color: '#0ea5e9', background: '#f0f9ff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><Eye size={18} /></button>
                                          <Link href={`/admin-dashboard/assignments/submissions/${item._id}`} style={{ padding: '10px', color: '#10b981', background: '#ecfdf5', borderRadius: '10px' }}><CheckCircle size={18} /></Link>
                                          <button onClick={() => startEdit(item)} style={{ padding: '10px', color: '#f59e0b', background: '#fffbeb', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><Edit3 size={18} /></button>
                                          <button onClick={() => deleteAssignment(item._id)} style={{ padding: '10px', color: '#f43f5e', background: '#fef2f2', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                    </div>
                              </div>
                        ))}
                  </div>

                  {/* Preview Modal remains same as previous */}
                  {previewItem && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
                              <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '28px', padding: '30px', position: 'relative' }}>
                                    <button onClick={() => setPreviewItem(null)} style={{ position: 'absolute', right: '20px', top: '20px', background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}><X size={20} /></button>
                                    <h3 style={{ color: '#0ea5e9', margin: '0 0 15px 0' }}>{previewItem.title}</h3>
                                    <div style={{ whiteSpace: 'pre-wrap', color: '#475569', fontSize: '15px', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>{previewItem.description}</div>
                                    {previewItem.attachment && <a href={previewItem.attachment} target="_blank" style={{ display: 'inline-block', marginTop: '20px', color: '#0ea5e9', fontWeight: 'bold', textDecoration: 'none' }}>📂 View Attachment</a>}
                              </div>
                        </div>
                  )}
            </div>
      );
}