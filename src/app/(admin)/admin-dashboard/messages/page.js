"use client";
import { useState, useEffect, useRef } from "react";
import {
      Search, Send, Link as LinkIcon, User,
      ArrowLeft, MoreVertical, CheckCheck, Circle, Layout, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMessenger() {
      const [students, setStudents] = useState([]);
      const [searchTerm, setSearchTerm] = useState("");
      const [selectedStudent, setSelectedStudent] = useState(null);
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState("");
      const [attachment, setAttachment] = useState("");
      const chatEndRef = useRef(null);

      useEffect(() => {
            const fetchStudents = async () => {
                  try {
                        const res = await fetch('/api/register');
                        const data = await res.json();
                        if (data.success) setStudents(data.students);
                  } catch (err) { console.error("Failed to fetch students"); }
            };
            fetchStudents();
      }, []);

      const filteredStudents = students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const scrollToBottom = () => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      useEffect(() => { scrollToBottom(); }, [messages]);

      useEffect(() => {
            if (selectedStudent) {
                  const studentId = selectedStudent._id;
                  const fetchChat = async () => {
                        const res = await fetch(`/api/messages?senderId=teacher_admin&receiverId=${studentId}`);
                        const data = await res.json();
                        if (data.success) setMessages(data.history);
                  };
                  fetchChat();
                  const interval = setInterval(fetchChat, 5000);
                  return () => clearInterval(interval);
            }
      }, [selectedStudent]);

      const sendMessage = async (e) => {
            e.preventDefault();
            if (!newMessage && !attachment) return;

            const studentId = selectedStudent._id;
            const payload = {
                  senderId: "teacher_admin",
                  receiverId: studentId,
                  senderName: "Teacher",
                  text: newMessage,
                  attachment: attachment
            };

            const res = await fetch('/api/messages', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
            });

            if (res.ok) {
                  setMessages([...messages, { ...payload, timestamp: new Date() }]);
                  setNewMessage("");
                  setAttachment("");
            }
      };

      return (
            <div style={{
                  height: '85vh', display: 'flex', backgroundColor: '#f0f4f8',
                  borderRadius: '30px', overflow: 'hidden', margin: '10px',
                  border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                  fontFamily: 'var(--font-rajdhani), sans-serif'
            }}>

                  {/* Sidebar - Soft Blue Theme */}
                  <div style={{
                        width: selectedStudent ? '380px' : '100%',
                        display: selectedStudent && typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
                        flexDirection: 'column', backgroundColor: '#ffffff', borderRight: '2px solid #e2e8f0'
                  }}>
                        <div style={{ padding: '30px', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: 'white' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                    <MessageSquare size={24} />
                                    <h2 style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '1px', margin: 0 }}>MESSENGER_HUB</h2>
                              </div>
                              <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                                    <input
                                          type="text" placeholder="Search student node..."
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                          style={{ width: '100%', backgroundColor: '#f8fafc', padding: '15px 15px 15px 50px', borderRadius: '15px', border: 'none', color: '#1e293b', fontWeight: '700', outline: 'none', fontSize: '14px' }}
                                    />
                              </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#f8fafc' }}>
                              {filteredStudents.map(student => (
                                    <motion.div
                                          whileHover={{ scale: 1.02 }}
                                          key={student._id}
                                          onClick={() => setSelectedStudent(student)}
                                          style={{
                                                padding: '15px', cursor: 'pointer', borderRadius: '20px', marginBottom: '10px',
                                                backgroundColor: selectedStudent?._id === student._id ? '#e0f2fe' : '#ffffff',
                                                border: selectedStudent?._id === student._id ? '2px solid #0ea5e9' : '2px solid transparent',
                                                display: 'flex', gap: '15px', alignItems: 'center', transition: '0.2s',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                                          }}
                                    >
                                          <div style={{ width: '55px', height: '55px', backgroundColor: selectedStudent?._id === student._id ? '#0ea5e9' : '#f1f5f9', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '22px', color: selectedStudent?._id === student._id ? 'white' : '#0ea5e9' }}>
                                                {student.name[0]}
                                          </div>
                                          <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: 0, fontWeight: '800', fontSize: '16px', color: '#0f172a' }}>{student.name}</h4>
                                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b', fontWeight: '700' }}>ID: {student.studentId}</p>
                                          </div>
                                          <Circle size={10} fill={selectedStudent?._id === student._id ? "#0ea5e9" : "#e2e8f0"} color="transparent" />
                                    </motion.div>
                              ))}
                        </div>
                  </div>

                  {/* Chat Window - Dynamic Background */}
                  <div style={{ flex: 1, display: !selectedStudent ? 'none' : 'flex', flexDirection: 'column', backgroundColor: '#f0f4f8' }}>
                        {selectedStudent && (
                              <>
                                    <div style={{ padding: '20px 30px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '2px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                          <button onClick={() => setSelectedStudent(null)} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: '#1e293b' }}>
                                                <ArrowLeft size={20} />
                                          </button>
                                          <div style={{ width: '45px', height: '45px', backgroundColor: '#0ea5e9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900' }}>{selectedStudent.name[0]}</div>
                                          <div>
                                                <div style={{ fontWeight: '900', color: '#0f172a', fontSize: '18px' }}>{selectedStudent.name}</div>
                                                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '800' }}>● ONLINE_STATION</div>
                                          </div>
                                          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b' }}><MoreVertical /></button>
                                    </div>

                                    {/* Message Display Area */}
                                    <div style={{
                                          flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px',
                                          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px'
                                    }}>
                                          {messages.map((msg, i) => (
                                                <motion.div
                                                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                      key={i} style={{
                                                            alignSelf: msg.senderId === 'teacher_admin' ? 'flex-end' : 'flex-start',
                                                            backgroundColor: msg.senderId === 'teacher_admin' ? '#0ea5e9' : '#ffffff',
                                                            color: msg.senderId === 'teacher_admin' ? 'white' : '#1e293b',
                                                            padding: '15px 20px', borderRadius: msg.senderId === 'teacher_admin' ? '25px 25px 0 25px' : '25px 25px 25px 0',
                                                            boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
                                                            maxWidth: '70%', position: 'relative', border: msg.senderId === 'teacher_admin' ? 'none' : '1px solid #e2e8f0'
                                                      }}>
                                                      <p style={{ margin: 0, fontWeight: '600', fontSize: '15px', lineHeight: '1.5' }}>{msg.text}</p>
                                                      {msg.attachment && (
                                                            <a href={msg.attachment} target="_blank" style={{
                                                                  marginTop: '10px', padding: '10px', backgroundColor: msg.senderId === 'teacher_admin' ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                                                                  borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit'
                                                            }}>
                                                                  <LinkIcon size={14} /> <span style={{ fontSize: '11px', fontWeight: '900' }}>VIEW_ATTACHED_PROTOCOL</span>
                                                            </a>
                                                      )}
                                                      <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '8px', textAlign: 'right', fontWeight: '700' }}>
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                      </div>
                                                </motion.div>
                                          ))}
                                          <div ref={chatEndRef} />
                                    </div>

                                    {/* Input Footer */}
                                    <form onSubmit={sendMessage} style={{ padding: '25px 35px', backgroundColor: '#ffffff', borderTop: '2px solid #e2e8f0', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                          <div style={{ flex: 1, display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '20px', padding: '5px 15px', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                                                <input
                                                      type="text" placeholder="Type command message..." value={newMessage}
                                                      onChange={(e) => setNewMessage(e.target.value)}
                                                      style={{ flex: 1, padding: '12px', background: 'none', border: 'none', outline: 'none', color: '#1e293b', fontWeight: '700', fontSize: '15px' }}
                                                />
                                                <div style={{ width: '1px', height: '25px', backgroundColor: '#cbd5e1', margin: '0 10px' }}></div>
                                                <LinkIcon size={18} color="#0ea5e9" style={{ cursor: 'pointer', opacity: 0.6 }} />
                                          </div>
                                          <input
                                                type="text" placeholder="Drive Link" value={attachment}
                                                onChange={(e) => setAttachment(e.target.value)}
                                                style={{ width: '140px', padding: '14px', borderRadius: '15px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', outline: 'none', color: '#0ea5e9', fontSize: '11px', fontWeight: '900' }}
                                          />
                                          <button type="submit" style={{
                                                backgroundColor: '#0ea5e9', color: 'white', border: 'none', width: '55px', height: '55px',
                                                borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', transition: '0.3s', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)'
                                          }}>
                                                <Send size={24} />
                                          </button>
                                    </form>
                              </>
                        )}
                  </div>

                  <style jsx global>{`
                      @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                      ::-webkit-scrollbar { width: 6px; }
                      ::-webkit-scrollbar-track { background: transparent; }
                      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                  `}</style>
            </div>
      );
}