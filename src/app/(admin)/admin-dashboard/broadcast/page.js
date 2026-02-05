"use client";
import { useState, useEffect } from "react";
import {
      Radio, Power, Megaphone, Send, Link as LinkIcon, Loader2,
      Globe, ShieldAlert, CheckCircle, AlertCircle, X, History, Trash2
} from "lucide-react";

export default function BroadcastManager() {
      const [liveLink, setLiveLink] = useState("");
      const [notice, setNotice] = useState("");
      const [isLive, setIsLive] = useState(false);
      const [loading, setLoading] = useState(false);
      const [status, setStatus] = useState("OFFLINE");

      const [history, setHistory] = useState([]);
      const [fetchingHistory, setFetchingHistory] = useState(true);
      const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
      const [confirmDelete, setConfirmDelete] = useState(null);

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
                              setStatus(data.config.isLive ? "LIVE_ON_AIR" : "STATION_OFFLINE");
                        }
                        setHistory(data.history || []);
                  }
            } catch (e) { console.error("Sync Error"); }
            finally { setFetchingHistory(false); }
      };

      useEffect(() => { fetchData(); }, []);

      const deleteHistoryLog = async () => {
            if (!confirmDelete) return;
            try {
                  const res = await fetch(`/api/broadcast?id=${confirmDelete}`, { method: 'DELETE' });
                  const data = await res.json();
                  if (data.success) {
                        showNotification("SIGNAL_LOG_PURGED", "success");
                        fetchData();
                  }
            } catch (e) { showNotification("PURGE_FAILED", "error"); }
            finally { setConfirmDelete(null); }
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
                        if (action === "live") { setIsLive(true); setStatus("LIVE_ON_AIR"); }
                        else if (action === "terminate") { setIsLive(false); setLiveLink(""); setStatus("STATION_OFFLINE"); }
                        showNotification(`${action.toUpperCase()}_SIGNAL_TRANSMITTED`, "success");
                        fetchData();
                  }
            } catch (e) { showNotification("TRANSMISSION_FAILED", "error"); }
            finally { setLoading(false); }
      };

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-rajdhani), sans-serif', padding: 'clamp(10px, 3vw, 20px)', paddingBottom: '100px' }}>

                  {/* MASTER TOAST NOTIFICATION */}
                  {toast.show && (
                        <div style={{ position: 'fixed', top: '30px', right: '30px', zIndex: 10000, backgroundColor: toast.type === "success" ? "#10b981" : "#f43f5e", color: 'white', padding: '18px 25px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'slideIn 0.3s ease-out' }}>
                              {toast.type === "success" ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
                              <span style={{ fontWeight: '900', fontSize: '13px', letterSpacing: '1px' }}>{toast.msg}</span>
                              <X size={16} style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => setToast({ ...toast, show: false })} />
                        </div>
                  )}

                  {/* CRITICAL DELETE MODAL */}
                  {confirmDelete && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                              <div style={{ backgroundColor: '#0f172a', border: '2px solid #f43f5e', padding: '40px', borderRadius: '35px', maxWidth: '450px', textAlign: 'center', boxShadow: '0 0 50px rgba(244, 63, 94, 0.2)' }}>
                                    <ShieldAlert size={60} color="#f43f5e" style={{ marginBottom: '20px' }} />
                                    <h3 style={{ color: 'white', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '1px' }}>ERASE_SIGNAL_LOG?</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>This action will permanently delete the selected signal history from the master archive.</p>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                          <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #1e293b', background: 'none', color: 'white', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
                                          <button onClick={deleteHistoryLog} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#f43f5e', color: 'white', fontWeight: '900', cursor: 'pointer' }}>ERASE_DATA</button>
                                    </div>
                              </div>
                        </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                              <h2 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '900', color: 'white', margin: 0, fontStyle: 'italic' }}>BROADCAST_COMMAND_HUB</h2>
                              <p style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '900', letterSpacing: '3px' }}>ENCRYPTED SIGNAL INTERFACE</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 25px', backgroundColor: isLive ? 'rgba(16, 185, 129, 0.1)' : '#1e293b', borderRadius: '18px', border: `2px solid ${isLive ? '#10b981' : '#334155'}`, boxShadow: isLive ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none' }}>
                              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isLive ? '#10b981' : '#64748b', animation: isLive ? 'pulse 1.2s infinite' : 'none' }}></div>
                              <span style={{ fontSize: '14px', fontWeight: '900', color: isLive ? '#10b981' : '#94a3b8', letterSpacing: '1px' }}>{status}</span>
                        </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '30px', marginBottom: '50px' }}>
                        {/* LIVE SIGNAL MODULE */}
                        <div style={{ backgroundColor: '#0f172a', padding: 'clamp(25px, 4vw, 40px)', borderRadius: '35px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '25px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#0ea5e9' }}><Radio size={28} /><h3 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>LIVE_LINK_TRANSMITTER</h3></div>
                              <div>
                                    <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '12px', fontWeight: '900' }}>TARGET_URL_ENDPOINT</label>
                                    <div style={{ position: 'relative' }}>
                                          <LinkIcon size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
                                          <input type="text" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://meet.google.com/..."
                                                style={{ width: '100%', padding: '18px 18px 18px 55px', backgroundColor: '#020617', border: '2px solid #1e293b', borderRadius: '18px', color: 'white', outline: 'none', fontWeight: '700', fontSize: '14px', transition: '0.3s' }}
                                                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'} onBlur={(e) => e.target.style.borderColor = '#1e293b'} />
                                    </div>
                              </div>
                              <div style={{ display: 'flex', gap: '15px' }}>
                                    <button onClick={() => handleUpdate("live", { liveLink, isLive: true })} disabled={loading || !liveLink}
                                          style={{ flex: 1.5, padding: '18px', backgroundColor: '#10b981', color: '#020617', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: '0.3s' }}>
                                          {loading ? <Loader2 className="animate-spin" size={20} /> : <Globe size={20} />} BROADCAST_START
                                    </button>
                                    <button onClick={() => handleUpdate("terminate", { liveLink: "", isLive: false })} disabled={loading || !isLive}
                                          style={{ flex: 1, padding: '18px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                          <Power size={20} /> KILL
                                    </button>
                              </div>
                        </div>

                        {/* NOTICE PUSH MODULE */}
                        <div style={{ backgroundColor: '#0f172a', padding: 'clamp(25px, 4vw, 40px)', borderRadius: '35px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '25px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#a855f7' }}><Megaphone size={28} /><h3 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>NOTICE_INJECTION_UNIT</h3></div>
                              <textarea value={notice} onChange={(e) => setNotice(e.target.value)} placeholder="Type global announcement for nodes..."
                                    style={{ width: '100%', height: '120px', padding: '20px', backgroundColor: '#020617', border: '2px solid #1e293b', borderRadius: '18px', color: 'white', outline: 'none', resize: 'none', fontSize: '15px', fontWeight: '600' }}
                                    onFocus={(e) => e.target.style.borderColor = '#a855f7'} onBlur={(e) => e.target.style.borderColor = '#1e293b'} />
                              <button onClick={() => handleUpdate("notice", { globalNotice: notice })} disabled={loading || !notice}
                                    style={{ width: '100%', padding: '18px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} INJECT_SIGNAL
                              </button>
                        </div>
                  </div>

                  {/* LOGS MODULE */}
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '35px', border: '1px solid #1e293b', overflow: 'hidden' }}>
                        <div style={{ padding: '25px 35px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <History size={22} color="#38bdf8" />
                              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'white', letterSpacing: '1px' }}>TRANSMISSION_HISTORY_LOG</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                                    <thead>
                                          <tr style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', borderBottom: '2px solid #1e293b' }}>
                                                <th style={{ padding: '25px' }}>Date_Time</th>
                                                <th style={{ padding: '25px' }}>Signal_Type</th>
                                                <th style={{ padding: '25px' }}>Payload_Content</th>
                                                <th style={{ padding: '25px', textAlign: 'right' }}>Management</th>
                                          </tr>
                                    </thead>
                                    <tbody style={{ color: '#cbd5e1' }}>
                                          {fetchingHistory ? (
                                                <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center' }}><Loader2 className="animate-spin" color="#38bdf8" size={32} /></td></tr>
                                          ) : history.length === 0 ? (
                                                <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', fontSize: '14px', fontWeight: '800', color: '#475569' }}>DATABASE_EMPTY: NO_SIGNAL_ARCHIVED</td></tr>
                                          ) : history.map((log) => (
                                                <tr key={log._id} style={{ borderBottom: '1px solid #1e293b', transition: '0.2s' }}>
                                                      <td style={{ padding: '20px 25px', fontWeight: '700', fontSize: '13px' }}>{new Date(log.date).toLocaleString()}</td>
                                                      <td style={{ padding: '20px 25px' }}>
                                                            <span style={{
                                                                  padding: '5px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '900',
                                                                  backgroundColor: log.type === "live" ? "rgba(16, 185, 129, 0.15)" : log.type === "terminate" ? "rgba(244, 63, 94, 0.15)" : "rgba(14, 165, 233, 0.15)",
                                                                  color: log.type === "live" ? "#10b981" : log.type === "terminate" ? "#f43f5e" : "#38bdf8",
                                                                  border: `1px solid ${log.type === "live" ? "#10b98133" : log.type === "terminate" ? "#f43f5e33" : "#38bdf833"}`
                                                            }}>
                                                                  {log.type.toUpperCase()}
                                                            </span>
                                                      </td>
                                                      <td style={{ padding: '20px 25px', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '600' }}>{log.content}</td>
                                                      <td style={{ padding: '20px 25px', textAlign: 'right' }}>
                                                            <button onClick={() => setConfirmDelete(log._id)} style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', color: '#f43f5e', padding: '8px', borderRadius: '10px', cursor: 'pointer', transition: '0.2s' }}>
                                                                  <Trash2 size={16} />
                                                            </button>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>

                  <style jsx global>{`
                        @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
                        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                        input::placeholder, textarea::placeholder { color: #475569 !important; font-weight: 500; }
                  `}</style>
            </div>
      );
}