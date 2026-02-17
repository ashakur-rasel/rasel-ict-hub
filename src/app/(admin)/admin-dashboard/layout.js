"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
      Users, FolderTree, Video, MessageSquare, LogOut, Menu, X,
      ShieldCheck, LayoutDashboard, BookOpen, Calendar, FileText,
      Settings, ChevronDown, Radio, Power, Megaphone, Activity
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }) {
      const [isOpen, setIsOpen] = useState(true);
      const [isProfileOpen, setIsProfileOpen] = useState(false);
      const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
      const [isMobile, setIsMobile] = useState(false);
      const [liveLink, setLiveLink] = useState("");
      const [notice, setNotice] = useState("");
      const [isLive, setIsLive] = useState(false);
      const [syncing, setSyncing] = useState(false);

      const pathname = usePathname();
      const router = useRouter();

      useEffect(() => {
            const handleResize = () => {
                  const mobile = window.innerWidth < 1024;
                  setIsMobile(mobile);
                  if (mobile) setIsOpen(false); // মোবাইলে ডিফল্টভাবে মেনু বন্ধ থাকবে
                  else setIsOpen(true);
            };
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
      }, []);

      const syncBroadcast = async (data) => {
            setSyncing(true);
            try {
                  const res = await fetch('/api/admin/broadcast', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                  });
                  if (res.ok) alert("SIGNAL_UPDATED_SUCCESSFULLY");
            } catch (e) { alert("SIGNAL_ERROR"); }
            finally { setSyncing(false); }
      };

      // মেনু আইটেমগুলো এখানে গুছিয়ে রাখা হয়েছে
      const menu = [
            { name: "Terminal", icon: <LayoutDashboard size={20} />, href: "/admin-dashboard" },
            { name: "Enrollment", icon: <Users size={20} />, href: "/admin-dashboard/users" },
            { name: "Pulse Hub", icon: <Activity size={20} />, href: "/admin-dashboard/blogs" }, // ব্লগ সেকশন
            { name: "Study Lessons", icon: <BookOpen size={20} />, href: "/admin-dashboard/lessons" },
            { name: "Resources", icon: <FolderTree size={20} />, href: "/admin-dashboard/resources" },
            { name: "Broadcast", icon: <Video size={20} />, href: "/admin-dashboard/broadcast" },
            { name: "Attendance", icon: <Calendar size={20} />, href: "/admin-dashboard/attendance" },
            { name: "Exam Lab", icon: <FileText size={20} />, href: "/admin-dashboard/exams" },
            { name: "Assignments", icon: <Settings size={20} />, href: "/admin-dashboard/assignments" },
            { name: "Messenger", icon: <MessageSquare size={20} />, href: "/admin-dashboard/messages" },
      ];

      return (
            <div style={{ backgroundColor: '#020617', color: '#f8fafc', height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: 'var(--font-rajdhani), sans-serif' }}>

                  {/* Sidebar Overlay for Mobile */}
                  {isMobile && isOpen && (
                        <div
                              onClick={() => setIsOpen(false)}
                              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)' }}
                        />
                  )}

                  <aside style={{
                        width: isOpen ? '280px' : (isMobile ? '0px' : '90px'),
                        position: isMobile ? 'fixed' : 'relative',
                        backgroundColor: '#0f172a',
                        borderRight: '2px solid #1e293b',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex', flexDirection: 'column', zIndex: 1000, height: '100vh',
                        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
                  }}>
                        <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center', padding: '0 20px', borderBottom: '1px solid #1e293b' }}>
                              <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                    <div style={{ padding: '10px', backgroundColor: '#0ea5e9', borderRadius: '14px', boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)' }}>
                                          <ShieldCheck size={26} color="#ffffff" />
                                    </div>
                                    {isOpen && <span style={{ marginLeft: '15px', fontWeight: '900', fontSize: '20px', color: '#38bdf8', letterSpacing: '2px' }}>CORE_HUB</span>}
                              </Link>
                        </div>

                        <nav style={{ flex: 1, padding: '20px 15px', overflowY: 'auto', overflowX: 'hidden' }}>
                              {menu.map((item) => (
                                    <Link key={item.name} href={item.href} onClick={() => isMobile && setIsOpen(false)} style={{
                                          display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '15px', textDecoration: 'none', marginBottom: '10px',
                                          backgroundColor: pathname === item.href ? '#3b82f6' : 'transparent',
                                          color: pathname === item.href ? '#ffffff' : '#94a3b8',
                                          boxShadow: pathname === item.href ? '0 10px 15px -3px rgba(59, 130, 246, 0.4)' : 'none',
                                          transition: '0.2s',
                                          justifyContent: isOpen ? 'flex-start' : 'center'
                                    }}>
                                          <span style={{ color: pathname === item.href ? '#ffffff' : '#38bdf8', flexShrink: 0 }}>{item.icon}</span>
                                          {isOpen && <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{item.name}</span>}
                                    </Link>
                              ))}
                        </nav>
                  </aside>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
                        <header style={{ height: '85px', backgroundColor: '#0f172a', borderBottom: '2px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 25px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <button onClick={() => setIsOpen(!isOpen)} style={{ background: '#1e293b', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '10px', borderRadius: '12px' }}>
                                          {isOpen ? <X size={22} /> : <Menu size={22} />}
                                    </button>

                                    <button
                                          onClick={() => setIsBroadcastOpen(!isBroadcastOpen)}
                                          style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '14px',
                                                background: isLive ? '#ef4444' : '#1e293b',
                                                border: 'none', color: 'white', fontSize: '12px', fontWeight: '900', cursor: 'pointer',
                                                boxShadow: isLive ? '0 0 15px #ef4444' : 'none'
                                          }}
                                    >
                                          <Radio size={18} />
                                          <span style={{ display: isMobile ? 'none' : 'block' }}>{isLive ? "LIVE_ON_AIR" : "BROADCAST_SIGNAL"}</span>
                                    </button>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ textAlign: 'right', display: isMobile ? 'none' : 'block' }}>
                                          <p style={{ fontSize: '14px', fontWeight: '900', color: '#ffffff', margin: 0 }}>A R RASEL</p>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                                                <p style={{ fontSize: '10px', color: '#10b981', fontWeight: '900', margin: 0 }}>ADMIN_ONLINE</p>
                                          </div>
                                    </div>
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <div style={{ height: '45px', width: '45px', borderRadius: '15px', backgroundColor: '#3b82f6', border: '2px solid #60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white' }}>AR</div>
                                          <ChevronDown size={20} color="#94a3b8" />
                                    </button>
                              </div>

                              {isProfileOpen && (
                                    <div style={{ position: 'absolute', right: '25px', top: '80px', width: '220px', backgroundColor: '#1e293b', borderRadius: '18px', padding: '10px', zIndex: 2000, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid #334155' }}>
                                          <button onClick={() => router.push('/login')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '900', fontSize: '13px' }}>
                                                <Power size={18} /> TERMINATE_SESSION
                                          </button>
                                    </div>
                              )}
                        </header>

                        {isBroadcastOpen && (
                              <div style={{ position: 'absolute', top: '95px', left: '25px', width: isMobile ? 'calc(100% - 50px)' : '380px', backgroundColor: '#1e293b', borderRadius: '25px', padding: '25px', zIndex: 1500, boxShadow: '0 25px 50px rgba(0,0,0,0.7)', border: '2px solid #334155' }}>
                                    <h4 style={{ fontSize: '12px', color: '#38bdf8', marginBottom: '20px', fontWeight: '900', letterSpacing: '1px' }}>SIGNAL_CONTROL_UNIT</h4>

                                    <div style={{ marginBottom: '20px' }}>
                                          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: '800' }}>LIVE_STREAM_LINK</label>
                                          <input type="text" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} style={{ width: '100%', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#38bdf8', fontSize: '13px', outline: 'none', fontWeight: '700' }} />
                                    </div>

                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                                          <button onClick={() => { setIsLive(true); syncBroadcast({ liveLink, isLive: true }); }} style={{ flex: 1, padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Radio size={16} /> TRANSMIT</button>
                                          <button onClick={() => { setIsLive(false); syncBroadcast({ isLive: false, liveLink: "" }); }} style={{ flex: 1, padding: '14px', backgroundColor: '#f43f5e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Power size={16} /> KILL_SIGNAL</button>
                                    </div>

                                    <div style={{ borderTop: '1px solid #334155', paddingTop: '20px' }}>
                                          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: '800' }}>GLOBAL_NOTICE_SYSTEM</label>
                                          <textarea value={notice} onChange={(e) => setNotice(e.target.value)} style={{ width: '100%', height: '80px', padding: '14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#ffffff', fontSize: '13px', outline: 'none', resize: 'none', fontWeight: '600' }} />
                                          <button onClick={() => syncBroadcast({ globalNotice: notice })} style={{ width: '100%', marginTop: '15px', padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Megaphone size={16} /> BROADCAST_NOTICE</button>
                                    </div>
                              </div>
                        )}

                        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px' : '40px', backgroundColor: '#020617' }}>
                              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                    {children}
                              </div>
                        </main>
                  </div>

                  <style jsx global>{`
                        @keyframes fadeIn {
                              from { opacity: 0; transform: translateY(10px); }
                              to { opacity: 1; transform: translateY(0); }
                        }
                        ::-webkit-scrollbar { width: 6px; }
                        ::-webkit-scrollbar-track { background: #020617; }
                        ::-webkit-scrollbar-thumb { background: #1e293b; borderRadius: 10px; }
                  `}</style>
            </div>
      );
}