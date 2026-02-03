"use client";
import { useState, useEffect } from "react";
import { UserPlus, Trash2, ShieldAlert, Loader2, Search } from "lucide-react";

export default function EnrollmentPage() {
      const [formData, setFormData] = useState({
            name: "", roll: "", college: "", phone: "", email: "", password: ""
      });
      const [students, setStudents] = useState([]);
      const [loading, setLoading] = useState(false);
      const [fetchLoading, setFetchLoading] = useState(true);

      // ডাটাবেস থেকে লিস্ট লোড করা
      const fetchStudents = async () => {
            try {
                  const res = await fetch('/api/register');
                  const data = await res.json();
                  if (data.success) setStudents(data.students);
            } catch (e) { console.error(e); }
            finally { setFetchLoading(false); }
      };

      useEffect(() => { fetchStudents(); }, []);

      // নতুন স্টুডেন্ট অ্যাড করা (POST)
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
                        alert("Student Node Successfully Deployed! 🚀");
                        setFormData({ name: "", roll: "", college: "", phone: "", email: "", password: "" });
                        fetchStudents();
                  }
            } catch (error) { alert("Deployment Failed!"); }
            finally { setLoading(false); }
      };

      // স্টুডেন্ট ডিলিট করা (DELETE)
      const handleDelete = async (id) => {
            if (!confirm("Are you sure to terminate this node?")) return;
            try {
                  const res = await fetch(`/api/register?id=${id}`, { method: "DELETE" });
                  const data = await res.json();
                  if (data.success) {
                        alert("Node Terminated! 🗑️");
                        fetchStudents();
                  }
            } catch (e) { alert("Deletion Failed!"); }
      };

      return (
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', fontFamily: 'var(--font-rajdhani), sans-serif' }}>

                  {/* 1. Registration Form */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(25px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '40px', borderRadius: '32px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#38bdf8', marginBottom: '30px', fontStyle: 'italic', textTransform: 'uppercase' }}>
                              <UserPlus size={24} style={{ display: 'inline', marginRight: '10px' }} /> Enrollment Protocol
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                              <InputBox label="Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} />
                              <InputBox label="Roll/ID" value={formData.roll} onChange={(v) => setFormData({ ...formData, roll: v })} />
                              <InputBox label="College" value={formData.college} onChange={(v) => setFormData({ ...formData, college: v })} />
                              <InputBox label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
                              <InputBox label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
                              <InputBox label="Passcode" type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} />

                              <button type="submit" disabled={loading} style={{ gridColumn: '1 / -1', marginTop: '10px', padding: '15px', backgroundColor: '#38bdf8', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }}>
                                    {loading ? "PROCESSING..." : "REGISTER NEW NODE"}
                              </button>
                        </form>
                  </div>

                  {/* 2. Management Table */}
                  <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '32px', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                              <h3 style={{ fontWeight: 'bold' }}>ACTIVE_NODE_DATABASE</h3>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>TOTAL: {students.length}</span>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                                          <tr>
                                                <th style={{ padding: '20px' }}>Identity</th>
                                                <th style={{ padding: '20px' }}>Roll</th>
                                                <th style={{ padding: '20px' }}>College</th>
                                                <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {fetchLoading ? (
                                                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Syncing Data...</td></tr>
                                          ) : students.map((s) => (
                                                <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                      <td style={{ padding: '20px', color: '#38bdf8', fontWeight: 'bold' }}>{s.name}</td>
                                                      <td style={{ padding: '20px' }}>#{s.studentId || s.roll}</td>
                                                      <td style={{ padding: '20px', color: '#94a3b8' }}>{s.college}</td>
                                                      <td style={{ padding: '20px', textAlign: 'right' }}>
                                                            <button onClick={() => handleDelete(s._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e' }}>
                                                                  <Trash2 size={18} />
                                                            </button>
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

function InputBox({ label, value, onChange, type = "text" }) {
      return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>{label}</label>
                  <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required
                        style={{ padding: '12px', backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', color: 'white' }} />
            </div>
      );
}