"use client";
import { useState, useEffect } from "react";
import {
      UserPlus, Trash2, ShieldAlert, Loader2, Search,
      Fingerprint, Smartphone, School, Mail, Key, CheckCircle2, XCircle
} from "lucide-react";

export default function EnrollmentPage() {
      const [formData, setFormData] = useState({
            name: "", roll: "", college: "", phone: "", email: "", password: ""
      });
      const [students, setStudents] = useState([]);
      const [loading, setLoading] = useState(false);
      const [fetchLoading, setFetchLoading] = useState(true);
      const [toast, setToast] = useState(null);
      const [deleteId, setDeleteId] = useState(null);

      const showNotification = (msg, type = "success") => {
            setToast({ msg, type });
            setTimeout(() => setToast(null), 4000);
      };

      const fetchStudents = async () => {
            try {
                  const res = await fetch('/api/register');
                  const data = await res.json();
                  if (data.success) setStudents(data.students);
            } catch (e) { console.error(e); }
            finally { setFetchLoading(false); }
      };

      useEffect(() => { fetchStudents(); }, []);

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
                  const res = await fetch("/api/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...formData, studentId: formData.roll }),
                  });
                  const data = await res.json();
                  if (data.success) {
                        showNotification("STUDENT_NODE_DEPLOYED_SUCCESSFULLY", "success");
                        setFormData({ name: "", roll: "", college: "", phone: "", email: "", password: "" });
                        fetchStudents();
                  }
            } catch (error) { showNotification("DEPLOYMENT_FAILED_IN_NETWORK", "error"); }
            finally { setLoading(false); }
      };

      const confirmDelete = async () => {
            if (!deleteId) return;
            try {
                  const res = await fetch(`/api/register?id=${deleteId}`, { method: "DELETE" });
                  const data = await res.json();
                  if (data.success) {
                        showNotification("NODE_TERMINATED_PERMANENTLY", "success");
                        fetchStudents();
                  }
            } catch (e) { showNotification("DELETION_FAILED", "error"); }
            finally { setDeleteId(null); }
      };

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'var(--font-rajdhani), sans-serif', padding: '10px' }}>

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

                  {deleteId && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
                              <div style={{ backgroundColor: '#0f172a', border: '2px solid #f43f5e', padding: '35px', borderRadius: '25px', maxWidth: '450px', textAlign: 'center' }}>
                                    <ShieldAlert size={50} color="#f43f5e" style={{ marginBottom: '20px' }} />
                                    <h3 style={{ color: 'white', fontWeight: '900', margin: '0 0 10px 0' }}>CRITICAL_ACTION_REQUIRED</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '25px' }}>Are you sure you want to terminate this student node? This action is irreversible within the master database.</p>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                          <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', background: 'none', color: 'white', fontWeight: '800', cursor: 'pointer' }}>CANCEL</button>
                                          <button onClick={confirmDelete} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#f43f5e', color: 'white', fontWeight: '800', cursor: 'pointer' }}>TERMINATE</button>
                                    </div>
                              </div>
                        </div>
                  )}

                  <div style={{ backgroundColor: '#0f172a', border: '2px solid #1e293b', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '35px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0ea5e9', marginBottom: '35px', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase' }}>
                              <UserPlus size={28} /> Enrollment_Protocol
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                              <InputBox label="FULL_IDENTITY_NAME" icon={<Fingerprint size={16} />} value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} />
                              <InputBox label="ROLL_MODULE_ID" icon={<Search size={16} />} value={formData.roll} onChange={(v) => setFormData({ ...formData, roll: v })} />
                              <InputBox label="COLLEGE_STATION" icon={<School size={16} />} value={formData.college} onChange={(v) => setFormData({ ...formData, college: v })} />
                              <InputBox label="PHONE_LINK" icon={<Smartphone size={16} />} value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
                              <InputBox label="EMAIL_NODE" type="email" icon={<Mail size={16} />} value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
                              <InputBox label="ACCESS_PASSCODE" type="password" icon={<Key size={16} />} value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} />

                              <button type="submit" disabled={loading} style={{
                                    gridColumn: '1 / -1', marginTop: '10px', padding: '18px', backgroundColor: '#0ea5e9',
                                    color: '#020617', border: 'none', borderRadius: '15px', fontWeight: '900',
                                    cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                              }}>
                                    {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
                                    {loading ? "INITIALIZING_SYNC..." : "DEPLOY_STUDENT_NODE"}
                              </button>
                        </form>
                  </div>

                  <div style={{ backgroundColor: '#0f172a', border: '2px solid #1e293b', borderRadius: '35px', overflow: 'hidden' }}>
                        <div style={{ padding: '25px 30px', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3 style={{ fontWeight: '900', color: '#38bdf8', fontSize: '14px', margin: 0 }}>ACTIVE_NODE_DATABASE</h3>
                              <div style={{ backgroundColor: '#0ea5e9', color: '#020617', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '900' }}>NODES: {students.length}</div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '800px' }}>
                                    <thead>
                                          <tr style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #1e293b' }}>
                                                <th style={{ padding: '20px' }}>Identity</th>
                                                <th style={{ padding: '20px' }}>Roll_ID</th>
                                                <th style={{ padding: '20px' }}>College_Station</th>
                                                <th style={{ padding: '20px', textAlign: 'right' }}>Security</th>
                                          </tr>
                                    </thead>
                                    <tbody style={{ color: 'white' }}>
                                          {fetchLoading ? (
                                                <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="animate-spin" color="#38bdf8" /></td></tr>
                                          ) : students.map((s) => (
                                                <tr key={s._id} style={{ borderBottom: '1px solid #1e293b', transition: '0.2s' }}>
                                                      <td style={{ padding: '20px', color: '#38bdf8', fontWeight: '900' }}>{s.name}</td>
                                                      <td style={{ padding: '20px', fontWeight: '700' }}>#{s.studentId}</td>
                                                      <td style={{ padding: '20px', color: '#94a3b8' }}>{s.college}</td>
                                                      <td style={{ padding: '20px', textAlign: 'right' }}>
                                                            <button onClick={() => setDeleteId(s._id)} style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', color: '#f43f5e', cursor: 'pointer', transition: '0.2s' }}>
                                                                  <Trash2 size={16} />
                                                            </button>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </table>
                        </div>
                  </div>

                  <style jsx>{`
                        @keyframes slideIn {
                              from { transform: translateX(100%); opacity: 0; }
                              to { transform: translateX(0); opacity: 1; }
                        }
                  `}</style>
            </div>
      );
}

function InputBox({ label, value, onChange, icon, type = "text" }) {
      return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '900', letterSpacing: '1px' }}>{label}</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', left: '12px', color: '#0ea5e9' }}>{icon}</div>
                        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required
                              style={{
                                    width: '100%', padding: '14px 14px 14px 40px', backgroundColor: '#020617',
                                    border: '1px solid #1e293b', borderRadius: '12px', color: 'white',
                                    fontWeight: '700', outline: 'none', transition: '0.3s'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                              onBlur={(e) => e.target.style.borderColor = '#1e293b'}
                        />
                  </div>
            </div>
      );
}