"use client";
import { useState, useEffect, useRef } from "react";
import {
      Search, Send, Link as LinkIcon, User,
      ArrowLeft, MoreVertical, CheckCheck, Circle
} from "lucide-react";

export default function AdminMessenger() {
      const [students, setStudents] = useState([]);
      const [searchTerm, setSearchTerm] = useState("");
      const [selectedStudent, setSelectedStudent] = useState(null);
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState("");
      const [attachment, setAttachment] = useState("");
      const chatEndRef = useRef(null);

      // ১. ডাটাবেস থেকে সব স্টুডেন্ট লিস্ট নিয়ে আসা
      useEffect(() => {
            const fetchStudents = async () => {
                  try {
                        const res = await fetch('/api/students');
                        const data = await res.json();
                        if (data.success) setStudents(data.students);
                  } catch (err) { console.error("Failed to fetch students"); }
            };
            fetchStudents();
      }, []);

      // ২. সার্চ ফিল্টার (বোল্ড টেক্সট সাপোর্ট)
      const filteredStudents = students.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const scrollToBottom = () => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      useEffect(() => { scrollToBottom(); }, [messages]);

      // ৩. চ্যাট হিস্ট্রি ফেচ করা (Real ID Logic)
      useEffect(() => {
            if (selectedStudent) {
                  const studentId = selectedStudent._id || selectedStudent.id;
                  const fetchChat = async () => {
                        const res = await fetch(`/api/messages?senderId=teacher_admin&receiverId=${studentId}`);
                        const data = await res.json();
                        if (data.success) setMessages(data.history);
                  };
                  fetchChat();
                  const interval = setInterval(fetchChat, 4000);
                  return () => clearInterval(interval);
            }
      }, [selectedStudent]);

      const sendMessage = async (e) => {
            e.preventDefault();
            if (!newMessage && !attachment) return;

            const studentId = selectedStudent._id || selectedStudent.id;
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
                  height: '88vh', display: 'flex', backgroundColor: '#ffffff',
                  borderRadius: '20px', overflow: 'hidden', margin: '10px',
                  border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  fontFamily: 'var(--font-rajdhani), sans-serif'
            }}>

                  {/* Sidebar */}
                  <div style={{
                        width: selectedStudent ? '350px' : '100%',
                        display: selectedStudent && typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex',
                        flexDirection: 'column', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0'
                  }}>
                        <div style={{ padding: '25px', backgroundColor: '#0ea5e9', color: 'white' }}>
                              <h2 style={{ fontWeight: '900', fontSize: '24px', letterSpacing: '1px', margin: 0 }}>INBOX_MESSAGES</h2>
                              <div style={{ position: 'relative', marginTop: '15px' }}>
                                    <Search style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} size={18} />
                                    <input
                                          type="text" placeholder="Search student name..."
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                          style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: 'none', color: '#1e293b', fontWeight: '700', outline: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
                                    />
                              </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                              {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                    <div
                                          key={student._id || student.id}
                                          onClick={() => setSelectedStudent(student)}
                                          style={{
                                                padding: '15px', cursor: 'pointer', borderRadius: '15px', marginBottom: '8px',
                                                backgroundColor: (selectedStudent?._id === student._id || selectedStudent?.id === student.id) ? '#0ea5e9' : 'white',
                                                color: (selectedStudent?._id === student._id || selectedStudent?.id === student.id) ? 'white' : '#1e293b',
                                                display: 'flex', gap: '15px', alignItems: 'center', transition: '0.3s ease',
                                                boxShadow: (selectedStudent?._id === student._id || selectedStudent?.id === student.id) ? '0 8px 15px rgba(14, 165, 233, 0.3)' : 'none'
                                          }}
                                    >
                                          <div style={{ width: '50px', height: '50px', backgroundColor: (selectedStudent?._id === student._id || selectedStudent?.id === student.id) ? 'rgba(255,255,255,0.2)' : '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px' }}>
                                                {student.name ? student.name[0] : 'U'}
                                          </div>
                                          <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: 0, fontWeight: '800', fontSize: '16px' }}>{student.name}</h4>
                                                <p style={{ margin: 0, fontSize: '12px', opacity: 0.7, fontWeight: '500' }}>{student.studentId || student.email}</p>
                                          </div>
                                    </div>
                              )) : <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px' }}>No students found.</p>}
                        </div>
                  </div>

                  {/* Chat Window */}
                  <div style={{ flex: 1, display: !selectedStudent ? 'none' : 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>
                        {selectedStudent && (
                              <>
                                    <div style={{ padding: '15px 25px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                          <ArrowLeft size={24} onClick={() => setSelectedStudent(null)} style={{ cursor: 'pointer', color: '#1e293b' }} />
                                          <div style={{ width: '40px', height: '40px', backgroundColor: '#0ea5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{selectedStudent.name[0]}</div>
                                          <div style={{ fontWeight: '900', color: '#0f172a', fontSize: '18px' }}>{selectedStudent.name}</div>
                                    </div>

                                    <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                          {messages.map((msg, i) => (
                                                <div key={i} style={{
                                                      alignSelf: msg.senderId === 'teacher_admin' ? 'flex-end' : 'flex-start',
                                                      backgroundColor: msg.senderId === 'teacher_admin' ? '#0ea5e9' : 'white',
                                                      color: msg.senderId === 'teacher_admin' ? 'white' : '#1e293b',
                                                      padding: '12px 18px', borderRadius: msg.senderId === 'teacher_admin' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                                      boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                                                      maxWidth: '75%', fontWeight: '600', fontSize: '15px'
                                                }}>
                                                      {msg.text}
                                                      {msg.attachment && (
                                                            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                                  <LinkIcon size={14} /> <a href={msg.attachment} target="_blank" style={{ color: 'inherit', fontSize: '12px', fontWeight: 'bold' }}>Drive Attachment</a>
                                                            </div>
                                                      )}
                                                      <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '5px', textAlign: 'right' }}>
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                      </div>
                                                </div>
                                          ))}
                                          <div ref={chatEndRef} />
                                    </div>

                                    {/* Footer Input */}
                                    <form onSubmit={sendMessage} style={{ padding: '20px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                          <input
                                                type="text" placeholder="Write message..." value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                style={{ flex: 1, padding: '14px 20px', borderRadius: '15px', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b', fontWeight: '700', backgroundColor: '#f8fafc' }}
                                          />
                                          <input
                                                type="text" placeholder="Drive Link" value={attachment}
                                                onChange={(e) => setAttachment(e.target.value)}
                                                style={{ width: '150px', padding: '14px 15px', borderRadius: '15px', border: '1px solid #e2e8f0', outline: 'none', color: '#0ea5e9', fontSize: '12px', fontWeight: 'bold' }}
                                          />
                                          <button type="submit" style={{ backgroundColor: '#0ea5e9', color: 'white', border: 'none', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}>
                                                <Send size={22} />
                                          </button>
                                    </form>
                              </>
                        )}
                  </div>
            </div>
      );
}