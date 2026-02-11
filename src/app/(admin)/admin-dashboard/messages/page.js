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

      const fetchInitialData = async () => {
            try {
                  const t = new Date().getTime();
                  const [regRes, msgRes] = await Promise.all([
                        fetch(`/api/register?t=${t}`),
                        fetch(`/api/messages?senderId=teacher_admin&t=${t}`)
                  ]);
                  const regData = await regRes.json();
                  const msgData = await msgRes.json();

                  if (regData.success) {
                        const allMessages = msgData.history || [];
                        const processed = regData.students.map(student => {
                              const chat = allMessages.filter(m => m.senderId === student._id || m.receiverId === student._id);
                              const last = chat.length > 0 ? chat[chat.length - 1] : { timestamp: 0, text: "No messages" };
                              const unread = chat.filter(m => m.senderId === student._id && !m.isRead).length;
                              return { ...student, lastInteraction: new Date(last.timestamp).getTime(), unreadCount: unread, lastText: last.text };
                        });
                        processed.sort((a, b) => b.lastInteraction - a.lastInteraction);
                        setStudents(processed);
                  }
            } catch (err) { console.error(err); }
      };

      useEffect(() => {
            fetchInitialData();
            const interval = setInterval(fetchInitialData, 4000);
            return () => clearInterval(interval);
      }, []);

      useEffect(() => {
            if (selectedStudent) {
                  const studentId = selectedStudent._id;
                  const fetchChat = async () => {
                        const res = await fetch(`/api/messages?senderId=teacher_admin&receiverId=${studentId}&t=${new Date().getTime()}`);
                        const data = await res.json();
                        if (data.success) {
                              setMessages(data.history);
                              if (data.history.some(m => m.senderId === studentId && !m.isRead)) {
                                    await fetch('/api/messages', {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ senderId: studentId, receiverId: 'teacher_admin' })
                                    });
                              }
                        }
                  };
                  fetchChat();
                  const interval = setInterval(fetchChat, 4000);
                  return () => clearInterval(interval);
            }
      }, [selectedStudent]);

      const sendMessage = async (e) => {
            e.preventDefault();
            if (!newMessage && !attachment) return;
            const payload = { senderId: "teacher_admin", receiverId: selectedStudent._id, senderName: "Teacher", text: newMessage, attachment };
            const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.ok) {
                  setMessages([...messages, { ...payload, timestamp: new Date() }]);
                  setNewMessage("");
                  setAttachment("");
                  fetchInitialData();
            }
      };

      useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

      return (
            <div style={{
                  height: 'calc(100vh - 120px)',
                  display: 'flex',
                  backgroundColor: '#f0f4f8',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  margin: '5px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  fontFamily: 'var(--font-rajdhani), sans-serif'
            }}>
                  {/* Sidebar */}
                  <div style={{
                        width: selectedStudent ? 'clamp(300px, 30%, 380px)' : '100%',
                        display: selectedStudent && typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        borderRight: '2px solid #e2e8f0',
                        transition: 'width 0.3s ease'
                  }}>
                        <div style={{ padding: '20px', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: 'white' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <MessageSquare size={20} />
                                    <h2 style={{ fontWeight: '900', fontSize: '18px', letterSpacing: '1px', margin: 0 }}>MESSENGER_HUB</h2>
                              </div>
                              <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
                                    <input type="text" placeholder="Search student node..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', backgroundColor: '#f8fafc', padding: '12px 12px 12px 40px', borderRadius: '12px', border: 'none', color: '#1e293b', fontWeight: '700', outline: 'none', fontSize: '13px' }} />
                              </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#f8fafc' }}>
                              {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(student => (
                                    <motion.div layout key={student._id} onClick={() => setSelectedStudent(student)}
                                          style={{
                                                padding: '12px', cursor: 'pointer', borderRadius: '15px', marginBottom: '8px',
                                                backgroundColor: selectedStudent?._id === student._id ? '#e0f2fe' : (student.unreadCount > 0 ? '#ffffff' : '#f8fafc'),
                                                border: selectedStudent?._id === student._id ? '2px solid #0ea5e9' : (student.unreadCount > 0 ? '2px solid #0ea5e9' : '2px solid transparent'),
                                                display: 'flex', gap: '12px', alignItems: 'center', transition: '0.2s',
                                                boxShadow: student.unreadCount > 0 ? '0 5px 15px rgba(14, 165, 233, 0.1)' : '0 2px 5px rgba(0,0,0,0.01)'
                                          }}>
                                          <div style={{ position: 'relative', flexShrink: 0 }}>
                                                <div style={{ width: '45px', height: '45px', backgroundColor: selectedStudent?._id === student._id || student.unreadCount > 0 ? '#0ea5e9' : '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px', color: selectedStudent?._id === student._id || student.unreadCount > 0 ? 'white' : '#0ea5e9' }}>{student.name[0]}</div>
                                                {student.unreadCount > 0 && (
                                                      <div style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '900', border: '2px solid white' }}>{student.unreadCount}</div>
                                                )}
                                          </div>
                                          <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <h4 style={{ margin: 0, fontWeight: student.unreadCount > 0 ? '900' : '800', fontSize: '14px', color: '#0f172a' }}>{student.name}</h4>
                                                <p style={{ margin: '2px 0 0', fontSize: '11px', color: student.unreadCount > 0 ? '#0ea5e9' : '#64748b', fontWeight: student.unreadCount > 0 ? '800' : '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ID: {student.studentId} • {student.lastText}</p>
                                          </div>
                                          <Circle size={8} fill={student.unreadCount > 0 ? "#ef4444" : (selectedStudent?._id === student._id ? "#0ea5e9" : "#e2e8f0")} color="transparent" />
                                    </motion.div>
                              ))}
                        </div>
                  </div>

                  {/* Chat Window */}
                  <div style={{
                        flex: 1,
                        display: !selectedStudent ? 'none' : 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#f0f4f8',
                        width: '100%'
                  }}>
                        {selectedStudent && (
                              <>
                                    <div style={{ padding: '15px 20px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '2px solid #e2e8f0' }}>
                                          <button onClick={() => setSelectedStudent(null)} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#1e293b' }}><ArrowLeft size={18} /></button>
                                          <div style={{ width: '40px', height: '40px', backgroundColor: '#0ea5e9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900' }}>{selectedStudent.name[0]}</div>
                                          <div style={{ overflow: 'hidden' }}>
                                                <div style={{ fontWeight: '900', color: '#0f172a', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedStudent.name}</div>
                                                <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '800' }}>● ONLINE</div>
                                          </div>
                                          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b' }}><MoreVertical size={20} /></button>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', backgroundImage: 'radial-gradient(#d1d5db 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }}>
                                          {messages.map((msg, i) => (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} style={{
                                                      alignSelf: msg.senderId === 'teacher_admin' ? 'flex-end' : 'flex-start',
                                                      backgroundColor: msg.senderId === 'teacher_admin' ? '#0ea5e9' : '#ffffff',
                                                      color: msg.senderId === 'teacher_admin' ? 'white' : '#1e293b',
                                                      padding: '12px 16px',
                                                      borderRadius: msg.senderId === 'teacher_admin' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                                      boxShadow: '0 5px 10px rgba(0,0,0,0.02)',
                                                      maxWidth: '85%',
                                                      position: 'relative',
                                                      border: msg.senderId === 'teacher_admin' ? 'none' : '1px solid #e2e8f0'
                                                }}>
                                                      <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', lineHeight: '1.4' }}>{msg.text}</p>
                                                      {msg.attachment && <a href={msg.attachment} target="_blank" style={{ marginTop: '8px', padding: '8px', backgroundColor: msg.senderId === 'teacher_admin' ? 'rgba(255,255,255,0.15)' : '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'inherit' }}><LinkIcon size={12} /> <span style={{ fontSize: '10px', fontWeight: '900' }}>PROTOCOL_VIEW</span></a>}
                                                      <div style={{ fontSize: '9px', opacity: 0.7, marginTop: '6px', textAlign: 'right', fontWeight: '700' }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </motion.div>
                                          ))}
                                          <div ref={chatEndRef} />
                                    </div>

                                    <form onSubmit={sendMessage} style={{ padding: '15px', backgroundColor: '#ffffff', borderTop: '2px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <div style={{ flex: 1, display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '15px', padding: '5px 12px', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                                                      <input type="text" placeholder="Message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, padding: '10px', background: 'none', border: 'none', outline: 'none', color: '#1e293b', fontWeight: '700', fontSize: '14px' }} />
                                                      <LinkIcon size={18} color="#0ea5e9" style={{ cursor: 'pointer', opacity: 0.6 }} />
                                                </div>
                                                <button type="submit" style={{ backgroundColor: '#0ea5e9', color: 'white', border: 'none', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><Send size={20} /></button>
                                          </div>
                                          <input type="text" placeholder="Drive/File Link" value={attachment} onChange={(e) => setAttachment(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', outline: 'none', color: '#0ea5e9', fontSize: '11px', fontWeight: '900' }} />
                                    </form>
                              </>
                        )}
                  </div>
            </div>
      );
}