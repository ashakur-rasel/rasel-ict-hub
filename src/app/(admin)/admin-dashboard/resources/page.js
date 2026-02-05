"use client";
import { useState, useEffect } from "react";
import {
      FolderPlus, FileText, Trash2, ExternalLink, FileType,
      Book, Layers, Eye, CheckCircle2, XCircle, Loader2, AlertTriangle, CloudIcon
} from "lucide-react";
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
      const [toast, setToast] = useState(null);
      const [confirmDelete, setConfirmDelete] = useState(null);

      const showNotification = (msg, type = "success") => {
            setToast({ msg, type });
            setTimeout(() => setToast(null), 4000);
      };

      const fetchResources = async () => {
            const res = await fetch('/api/resources');
            const data = await res.json();
            if (data.success) setResources(data.resources);
      };

      useEffect(() => { fetchResources(); }, []);

      const saveResource = async () => {
            if (!formData.title || !formData.driveLink) return showNotification("FILL_ALL_REQUIRED_NODES", "error");
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
                        showNotification("RESOURCE_SYNCHRONIZED_SUCCESSFULLY", "success");
                        setFormData({ ...formData, title: "", driveLink: "" });
                        fetchResources();
                  }
            } catch (e) { showNotification("CLOUD_SYNC_FAILED", "error"); }
            finally { setLoading(false); }
      };

      const deleteResource = async () => {
            if (!confirmDelete) return;
            const res = await fetch(`/api/resources?id=${confirmDelete}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                  showNotification("ASSET_PURGED_FROM_SYSTEM", "success");
                  fetchResources();
            }
            setConfirmDelete(null);
      };

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', padding: '10px 10px 100px' }}>

                  {toast && (
                        <div style={{
                              position: 'fixed', top: '30px', right: '30px', padding: '15px 25px', borderRadius: '15px', zIndex: 10000,
                              backgroundColor: toast.type === "success" ? '#10b981' : '#f43f5e', color: 'white', fontWeight: '900',
                              display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                              animation: 'slideIn 0.3s ease-out'
                        }}>
                              {toast.type === "success" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                              {toast.msg}
                        </div>
                  )}

                  {confirmDelete && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                              <div style={{ backgroundColor: '#0f172a', border: '2px solid #f43f5e', padding: '35px', borderRadius: '30px', maxWidth: '450px', textAlign: 'center' }}>
                                    <AlertTriangle size={50} color="#f43f5e" style={{ marginBottom: '20px' }} />
                                    <h3 style={{ color: 'white', fontWeight: '900', margin: '0 0 10px 0' }}>CONFIRM_DELETION</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>This asset will be permanently removed from the resource library.</p>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                          <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', background: 'none', color: 'white', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
                                          <button onClick={deleteResource} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#f43f5e', color: 'white', fontWeight: '800', cursor: 'pointer' }}>DELETE</button>
                                    </div>
                              </div>
                        </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                              <h2 style={{ color: '#38bdf8', fontWeight: '900', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                                    <Layers size={28} /> RESOURCE_CORE_ENGINE
                              </h2>
                              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: '900', letterSpacing: '2px' }}>ASSET_UPLOADER_STATION</p>
                        </div>
                        <Link href="/admin-dashboard/resources/view" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px', backgroundColor: '#0ea5e9', color: '#020617', borderRadius: '14px', textDecoration: 'none', fontWeight: '900', fontSize: '13px', boxShadow: '0 5px 15px rgba(14, 165, 233, 0.4)' }}>
                              <Eye size={18} /> OPEN_PORTAL_VIEW
                        </Link>
                  </div>

                  <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '35px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'grid', gap: '25px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <label style={{ color: '#38bdf8', fontSize: '11px', fontWeight: '900' }}>ASSET_CATEGORY</label>
                                          <select value={formData.chapter} onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                                style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid #1e293b', color: 'white', borderRadius: '12px', outline: 'none', fontWeight: '700' }}>
                                                {Object.keys(categories).map(key => <option key={key} value={key}>{categories[key]}</option>)}
                                          </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <label style={{ color: '#38bdf8', fontSize: '11px', fontWeight: '900' }}>EXTENSION_TYPE</label>
                                          <select value={formData.fileType} onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                                                style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid #1e293b', color: 'white', borderRadius: '12px', outline: 'none', fontWeight: '700' }}>
                                                {fileTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                          </select>
                                    </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: '#38bdf8', fontSize: '11px', fontWeight: '900' }}>RESOURCE_DISPLAY_NAME</label>
                                    <input type="text" placeholder="Entry asset title..." value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                          style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid #1e293b', color: 'white', borderRadius: '12px', outline: 'none', fontWeight: '700' }} />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ color: '#38bdf8', fontSize: '11px', fontWeight: '900' }}>CLOUD_LINK_PROTOCOL (DRIVE/CDN)</label>
                                    <input type="text" placeholder="https://drive.google.com/..." value={formData.driveLink} onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                                          style={{ padding: '15px', backgroundColor: '#020617', border: '1px solid #1e293b', color: '#10b981', borderRadius: '12px', outline: 'none', fontWeight: '700' }} />
                              </div>

                              <button onClick={saveResource} disabled={loading} style={{
                                    padding: '18px', backgroundColor: '#0ea5e9', color: '#020617', fontWeight: '900', borderRadius: '15px',
                                    cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px'
                              }}>
                                    {loading ? <Loader2 className="animate-spin" /> : <CloudIcon size={20} />}
                                    {loading ? "INITIALIZING_SYNC..." : "TRANSMIT_ASSET_TO_CLOUD"}
                              </button>
                        </div>
                  </div>

                  <div style={{ marginTop: '50px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '35px', overflow: 'hidden' }}>
                        <div style={{ padding: '25px 30px', backgroundColor: '#1e293b', color: '#38bdf8', fontWeight: '900', fontSize: '14px' }}>ASSET_STORAGE_INDEX</div>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
                                    <thead style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                                          <tr style={{ borderBottom: '1px solid #1e293b' }}>
                                                <th style={{ padding: '20px' }}>File_Asset</th>
                                                <th style={{ padding: '20px' }}>Unit_Category</th>
                                                <th style={{ padding: '20px' }}>Format</th>
                                                <th style={{ padding: '20px', textAlign: 'right' }}>Command</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {resources.map(res => (
                                                <tr key={res._id} style={{ borderBottom: '1px solid #1e293b', transition: '0.2s' }}>
                                                      <td style={{ padding: '20px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                  <FileText size={18} color="#38bdf8" />
                                                                  <span style={{ color: 'white', fontWeight: '800' }}>{res.title}</span>
                                                            </div>
                                                      </td>
                                                      <td style={{ padding: '20px', color: '#94a3b8', fontSize: '13px', fontWeight: '700' }}>{res.chapterTitle}</td>
                                                      <td style={{ padding: '20px' }}>
                                                            <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' }}>{res.fileType}</span>
                                                      </td>
                                                      <td style={{ padding: '20px', textAlign: 'right' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                                                  <a href={res.driveLink} target="_blank" style={{ color: '#0ea5e9' }}><ExternalLink size={18} /></a>
                                                                  <button onClick={() => setConfirmDelete(res._id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                                            </div>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>
            </div>
      );
}