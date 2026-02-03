"use client";
import { useState, useEffect } from "react";
import { Radio, Power, Megaphone, Send, Link as LinkIcon, Loader2, Globe, ShieldAlert, CheckCircle, AlertCircle, X, History, Trash2 } from "lucide-react";

export default function BroadcastManager() {
      const [liveLink, setLiveLink] = useState("");
      const [notice, setNotice] = useState("");
      const [isLive, setIsLive] = useState(false);
      const [loading, setLoading] = useState(false);
      const [status, setStatus] = useState("OFFLINE");

      const [history, setHistory] = useState([]);
      const [fetchingHistory, setFetchingHistory] = useState(true);
      const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

      const showNotification = (msg, type = "success") => {
            setToast({ show: true, msg, type });
            setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 4000);
      };

      const fetchData = async () => {
            setFetchingHistory(true);
            try {
                  const res = await fetch('/api/broadcast');
                  const data = await res.json();
                  if (data.success) {
                        if (data.config) {
                              setLiveLink(data.config.liveLink || "");
                              setNotice(data.config.globalNotice || "");
                              setIsLive(data.config.isLive);
                              setStatus(data.config.isLive ? "LIVE NOW" : "OFFLINE");
                        }
                        setHistory(data.history || []);
                  }
            } catch (e) { console.error("Sync error"); }
            finally { setFetchingHistory(false); }
      };

      useEffect(() => { fetchData(); }, []);

      const deleteHistory = async (id) => {
            if (!confirm("Permanently delete this signal log?")) return;
            try {
                  const res = await fetch(`/api/broadcast?id=${id}`, { method: 'DELETE' });
                  const data = await res.json();
                  if (data.success) {
                        showNotification("Log Erased Successfully!", "success");
                        fetchData();
                  }
            } catch (e) { showNotification("Deletion Failed!", "error"); }
      };

      const handleUpdate = async (action, data) => {
            setLoading(true);
            try {
                  const res = await fetch('/api/broadcast', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...data, actionType: action })
                  });
                  const resData = await res.json();
                  if (resData.success) {
                        if (action === "live") { setIsLive(true); setStatus("LIVE NOW"); }
                        else if (action === "terminate") { setIsLive(false); setLiveLink(""); setStatus("OFFLINE"); }
                        showNotification(`${action.toUpperCase()} Signal Deployed!`, "success");
                        fetchData();
                  }
            } catch (e) { showNotification("Transmission Failed!", "error"); }
            finally { setLoading(false); }
      };

      return (
            <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', padding: 'clamp(10px, 3vw, 20px)' }}>

                  {/* Custom Toast Notification */}
                  {toast.show && (
                        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, backgroundColor: toast.type === "success" ? "#059669" : "#dc2626", color: 'white', padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.3)', animation: 'slideIn 0.4s ease-out' }}>
                              {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{toast.msg}</span>
                              <X size={16} style={{ cursor: 'pointer' }} onClick={() => setToast({ ...toast, show: false })} />
                        </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                              <h2 style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: '900', color: 'white', margin: 0 }}>BROADCAST_SIGNAL_CORE</h2>
                              <p style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>GLOBAL COMMAND INTERFACE</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', backgroundColor: isLive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '15px', border: `1px solid ${isLive ? '#10b981' : '#ef4444'}` }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isLive ? '#10b981' : '#ef4444', animation: isLive ? 'pulse 1.5s infinite' : 'none' }}></div>
                              <span style={{ fontSize: '14px', fontWeight: '900', color: isLive ? '#10b981' : '#ef4444' }}>{status}</span>
                        </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '25px', marginBottom: '40px' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: 'clamp(20px, 4vw, 35px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0ea5e9' }}><Radio size={24} /><h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>LIVE_SESSION_SYNC</h3></div>
                              <div>
                                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>URL_ENDPOINT</label>
                                    <div style={{ position: 'relative' }}>
                                          <LinkIcon size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                                          <input type="text" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="Paste Meet/Zoom link..." style={{ width: '100%', padding: '15px 15px 15px 45px', backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', outline: 'none' }} />
                                    </div>
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    <button onClick={() => handleUpdate("live", { liveLink, isLive: true })} disabled={loading || !liveLink} style={{ flex: 1, padding: '16px', backgroundColor: '#10b981', color: '#020617', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{loading ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />} START</button>
                                    <button onClick={() => handleUpdate("terminate", { liveLink: "", isLive: false })} disabled={loading || !isLive} style={{ flex: 1, padding: '16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Power size={18} /> TERMINATE</button>
                              </div>
                        </div>

                        <div style={{ backgroundColor: '#0f172a', padding: 'clamp(20px, 4vw, 35px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#a855f7' }}><Megaphone size={24} /><h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>NOTICE_BOARD_PUSH</h3></div>
                              <textarea value={notice} onChange={(e) => setNotice(e.target.value)} placeholder="Enter announcement text..." style={{ width: '100%', height: '110px', padding: '15px', backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', outline: 'none', resize: 'none', fontSize: '14px' }} />
                              <button onClick={() => handleUpdate("notice", { globalNotice: notice })} disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#0ea5e9', color: '#020617', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} PUSH_SIGNAL</button>
                        </div>
                  </div>

                  {/* History Table */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}><History size={20} color="#38bdf8" /><h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>Signal_History_Log</h3></div>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                    <thead><tr style={{ color: '#64748b', fontSize: '11px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><th style={{ padding: '20px' }}>TIMESTAMP</th><th style={{ padding: '20px' }}>TYPE</th><th style={{ padding: '20px' }}>SIGNAL_CONTENT</th><th style={{ padding: '20px', textAlign: 'right' }}>ACTION</th></tr></thead>
                                    <tbody style={{ color: '#cbd5e1' }}>
                                          {fetchingHistory ? (<tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="animate-spin" color="#38bdf8" /></td></tr>) :
                                                history.length === 0 ? (<tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', fontSize: '13px' }}>No archived signals.</td></tr>) :
                                                      history.map((log) => (
                                                            <tr key={log._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '13px' }}>
                                                                  <td style={{ padding: '15px 20px', whiteSpace: 'nowrap' }}>{new Date(log.date).toLocaleString()}</td>
                                                                  <td style={{ padding: '15px 20px' }}>
                                                                        <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', backgroundColor: log.type === "live" ? "rgba(16, 185, 129, 0.1)" : log.type === "terminate" ? "rgba(244, 63, 94, 0.1)" : "rgba(14, 165, 233, 0.1)", color: log.type === "live" ? "#10b981" : log.type === "terminate" ? "#f43f5e" : "#0ea5e9" }}>{log.type.toUpperCase()}</span>
                                                                  </td>
                                                                  <td style={{ padding: '15px 20px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.content}</td>
                                                                  <td style={{ padding: '15px 20px', textAlign: 'right' }}><button onClick={() => deleteHistory(log._id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '5px' }}><Trash2 size={18} /></button></td>
                                                            </tr>
                                                      ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>

                  <style jsx>{`
                        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
                        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                  `}</style>
            </div>
      );
}