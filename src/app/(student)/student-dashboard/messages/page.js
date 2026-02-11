"use client";
import { useState, useEffect, useRef } from "react";
import {
      Send, Link as LinkIcon, User,
      MessageSquare, ArrowLeft, Zap, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function StudentMessenger() {
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState("");
      const [attachment, setAttachment] = useState("");
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const chatEndRef = useRef(null);

      useEffect(() => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            setUser(storedUser);

            if (storedUser._id) {
                  const fetchChat = async () => {
                        try {
                              const res = await fetch(`/api/messages?senderId=${storedUser._id}&receiverId=teacher_admin`);
                              const data = await res.json();
                              if (data.success) {
                                    setMessages(data.history);
                                    setLoading(false);
                              }
                        } catch (err) { console.error("Sync Error"); }
                  };

                  fetchChat();
                  const interval = setInterval(fetchChat, 5000);
                  return () => clearInterval(interval);
            }
      }, []);

      useEffect(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [messages]);

      const sendMessage = async (e) => {
            e.preventDefault();
            if (!newMessage && !attachment) return;

            const payload = {
                  senderId: user._id,
                  receiverId: "teacher_admin",
                  senderName: user.name,
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

      if (loading) return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                        <Zap size={40} className="text-blue-500" />
                  </motion.div>
                  <p className="text-blue-400 font-black tracking-widest text-xs uppercase">Connecting to Teacher Hub...</p>
            </div>
      );

      return (
            <div className="max-w-4xl mx-auto h-[82vh] flex flex-col bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">

                  <div className="p-4 md:p-6 border-b border-white/5 bg-gradient-to-r from-blue-600/10 to-transparent flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                              <Link href="/student-dashboard" className="flex items-center gap-2 p-2 px-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 group">
                                    <ArrowLeft size={18} className="text-gray-400 group-hover:text-white" />
                                    <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-white tracking-widest">Home</span>
                              </Link>

                              <div className="w-[1px] h-6 bg-white/10 mx-1 hidden sm:block" />

                              <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                          <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                          <h2 className="text-white font-black uppercase italic tracking-tighter text-sm md:text-lg leading-none">Instructor_Support</h2>
                                          <p className="text-emerald-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1 mt-1">
                                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Online
                                          </p>
                                    </div>
                              </div>
                        </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                        {messages.length === 0 && (
                              <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                                    <MessageSquare size={60} />
                                    <p className="font-black uppercase tracking-widest text-[10px] mt-4">Initiate Secure Channel</p>
                              </div>
                        )}
                        {messages.map((msg, i) => {
                              const isMe = msg.senderId === user._id;
                              return (
                                    <motion.div
                                          initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          key={i}
                                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                    >
                                          <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-[1.5rem] text-sm font-medium ${isMe
                                                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10'
                                                : 'bg-slate-800 text-blue-100 rounded-tl-none border border-white/5'
                                                }`}>
                                                <p className="leading-relaxed text-[13px] md:text-[14px]">{msg.text}</p>
                                                {msg.attachment && (
                                                      <a href={msg.attachment} target="_blank" className={`mt-3 flex items-center gap-2 p-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase border transition-all ${isMe ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400'
                                                            }`}>
                                                            <LinkIcon size={12} /> View_Attached_Protocol
                                                      </a>
                                                )}
                                                <div className={`text-[7px] md:text-[8px] mt-2 font-bold opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                                                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                          </div>
                                    </motion.div>
                              );
                        })}
                        <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={sendMessage} className="p-4 md:p-6 bg-slate-900/80 border-t border-white/5 space-y-3">
                        <div className="flex gap-2 md:gap-3">
                              <div className="flex-1 relative">
                                    <input
                                          type="text"
                                          placeholder="Type secure message..."
                                          value={newMessage}
                                          onChange={(e) => setNewMessage(e.target.value)}
                                          className="w-full bg-[#020617] border border-white/5 p-3 md:p-4 pl-5 md:pl-6 rounded-xl md:rounded-2xl text-white text-xs md:text-sm outline-none focus:border-blue-500 transition-all font-medium"
                                    />
                              </div>
                              <input
                                    type="text"
                                    placeholder="Drive Link"
                                    value={attachment}
                                    onChange={(e) => setAttachment(e.target.value)}
                                    className="hidden lg:block w-40 bg-[#020617] border border-white/5 p-4 rounded-2xl text-blue-400 text-[10px] outline-none font-black uppercase tracking-widest focus:border-blue-500 transition-all"
                              />
                              <button type="submit" className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all flex-shrink-0">
                                    <Send size={20} className="md:size-6" />
                              </button>
                        </div>
                        <input
                              type="text"
                              placeholder="Attach Drive Link (Optional)"
                              value={attachment}
                              onChange={(e) => setAttachment(e.target.value)}
                              className="lg:hidden w-full bg-[#020617] border border-white/5 p-3 rounded-xl text-blue-400 text-[9px] md:text-[10px] outline-none font-black uppercase tracking-widest focus:border-blue-500 transition-all"
                        />
                  </form>

                  <style jsx global>{`
                        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                  `}</style>
            </div>
      );
}