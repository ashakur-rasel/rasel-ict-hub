"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
      Users, FolderTree, Video, MessageSquare, LogOut, Menu, X,
      ShieldCheck, LayoutDashboard, BookOpen, Calendar, FileText,
      Settings, ChevronDown, Radio, Power, Megaphone, Loader2
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }) {
      const [isOpen, setIsOpen] = useState(true);
      const [isProfileOpen, setIsProfileOpen] = useState(false);
      const [isBroadcastOpen, setIsBroadcastOpen] = useState(false); // ব্রডকাস্ট প্যানেল স্টেট
      const [isMobile, setIsMobile] = useState(false);

      // Broadcast States
      const [liveLink, setLiveLink] = useState("");
      const [notice, setNotice] = useState("");
      const [isLive, setIsLive] = useState(false);
      const [syncing, setSyncing] = useState(false);

      const pathname = usePathname();
      const router = useRouter();

      // Screen resize handling
      useEffect(() => {
            const handleResize = () => {
                  const mobile = window.innerWidth < 1024;
                  setIsMobile(mobile);
                  if (mobile) setIsOpen(false);
                  else setIsOpen(true);
            };
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
      }, []);

      // ব্রডকাস্ট সিঙ্ক করার ফাংশন
      const syncBroadcast = async (data) => {
            setSyncing(true);
            try {
                  const res = await fetch('/api/admin/broadcast', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                  });
                  if (res.ok) alert("Broadcast Signal Updated! 📡");
            } catch (e) { alert("Signal Failed!"); }
            finally { setSyncing(false); }
      };

      const menu = [
            { name: "Terminal", icon: <LayoutDashboard size={20} />, href: "/admin-dashboard" },
            { name: "Enrollment", icon: <Users size={20} />, href: "/admin-dashboard/users" },
            { name: "Study Lessons", icon: <BookOpen size={20} />, href: "/admin-dashboard/lessons" },
            { name: "Resources", icon: <FolderTree size={20} />, href: "/admin-dashboard/resources" },
            { name: "Broadcast", icon: <Video size={20} />, href: "/admin-dashboard/broadcast" },
            { name: "Attendance", icon: <Calendar size={20} />, href: "/admin-dashboard/attendance" },
            { name: "Exam Lab", icon: <FileText size={20} />, href: "/admin-dashboard/exams" },
            { name: "Assignments", icon: <Settings size={20} />, href: "/admin-dashboard/assignments" },
            { name: "Messenger", icon: <MessageSquare size={20} />, href: "/admin-dashboard/messages" },
      ];

      return (
            <div style={{ backgroundColor: '#020617', color: 'white', height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: 'var(--font-rajdhani), sans-serif' }}>

                  {/* Sidebar (আগের মতোই আছে) */}
                  <aside style={{
                        width: isOpen ? (isMobile ? '100%' : '288px') : (isMobile ? '0px' : '80px'),
                        position: isMobile ? 'absolute' : 'relative',
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(30px)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex', flexDirection: 'column', zIndex: 100, height: '100vh',
                        visibility: isMobile && !isOpen ? 'hidden' : 'visible'
                  }}>
                        <div style={{ height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                              <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                                    <div style={{ padding: '8px', backgroundColor: '#0284c7', borderRadius: '12px', boxShadow: '0 0 15px rgba(2, 132, 199, 0.5)' }}>
                                          <ShieldCheck size={24} color="white" />
                                    </div>
                                    {isOpen && <span style={{ marginLeft: '12px', fontWeight: '900', fontSize: '18px', fontStyle: 'italic', color: '#38bdf8', letterSpacing: '1px' }}>CORE_COMMAND</span>}
                              </Link>
                              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: isOpen ? 'block' : 'none' }}>
                                    <X size={24} />
                              </button>
                        </div>

                        <nav style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                              {menu.map((item) => (
                                    <Link key={item.name} href={item.href} onClick={() => isMobile && setIsOpen(false)} style={{
                                          display: 'flex', alignItems: 'center', gap: '15px', padding: '14px', borderRadius: '16px', textDecoration: 'none', marginBottom: '8px',
                                          backgroundColor: pathname === item.href ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                                          borderLeft: pathname === item.href ? '4px solid #0ea5e9' : '4px solid transparent',
                                          color: pathname === item.href ? '#38bdf8' : '#94a3b8', transition: '0.3s'
                                    }}>
                                          {item.icon}
                                          {isOpen && <span style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.name}</span>}
                                    </Link>
                              ))}
                        </nav>
                  </aside>

                  {/* Main Area */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <header style={{ height: '80px', backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    {!isOpen && (
                                          <button onClick={() => setIsOpen(true)} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}>
                                                <Menu size={24} />
                                          </button>
                                    )}

                                    {/* Broadcast Trigger Button (New)  */}
                                    <button
                                          onClick={() => setIsBroadcastOpen(!isBroadcastOpen)}
                                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', borderRadius: '12px', background: isLive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(56, 189, 248, 0.1)', border: `1px solid ${isLive ? '#ef4444' : '#38bdf8'}`, color: isLive ? '#ef4444' : '#38bdf8', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                          <Radio size={16} className={isLive ? "animate-pulse" : ""} />
                                          <span style={{ display: isMobile ? 'none' : 'block' }}>{isLive ? "SESSION_LIVE" : "SIGNAL_CONTROL"}</span>
                                    </button>
                              </div>

                              {/* Broadcast Dropdown Panel */}
                              {isBroadcastOpen && (
                                    <div style={{ position: 'absolute', top: '85px', left: '24px', width: isMobile ? 'calc(100% - 48px)' : '350px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px', zIndex: 120, boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                                          <h4 style={{ fontSize: '11px', color: '#64748b', marginBottom: '15px', textTransform: 'uppercase' }}>Broadcast_Control_Center</h4>

                                          {/* Live Link Section */}
                                          <div style={{ marginBottom: '15px' }}>
                                                <label style={{ fontSize: '10px', color: '#38bdf8', display: 'block', marginBottom: '5px' }}>LIVE_CLASS_URL</label>
                                                <input type="text" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="https://zoom.us/..." style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'white', fontSize: '12px', outline: 'none' }} />
                                          </div>

                                          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                                <button onClick={() => { setIsLive(true); syncBroadcast({ liveLink, isLive: true }); }} style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: '#020617', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}><Radio size={14} /> GO_LIVE</button>
                                                <button onClick={() => { setIsLive(false); syncBroadcast({ isLive: false, liveLink: "" }); }} style={{ flex: 1, padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}><Power size={14} /> TERMINATE</button>
                                          </div>

                                          {/* Notice Section */}
                                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                                                <label style={{ fontSize: '10px', color: '#38bdf8', display: 'block', marginBottom: '5px' }}>GLOBAL_NOTICE_BOARD</label>
                                                <textarea value={notice} onChange={(e) => setNotice(e.target.value)} placeholder="Type update for students..." style={{ width: '100%', height: '60px', padding: '10px', backgroundColor: 'rgba(2, 6, 23, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'white', fontSize: '12px', outline: 'none', resize: 'none' }} />
                                                <button onClick={() => syncBroadcast({ globalNotice: notice })} style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#0ea5e9', color: '#020617', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}><Megaphone size={14} /> UPDATE_NOTICE</button>
                                          </div>
                                    </div>
                              )}

                              <div style={{ position: 'relative' }}>
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: 'white' }}>
                                          <div style={{ textAlign: 'right', display: isMobile ? 'none' : 'block' }}>
                                                <p style={{ fontSize: '14px', fontWeight: '900', margin: 0 }}>A R RASEL</p>
                                                <p style={{ fontSize: '10px', color: '#0ea5e9', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Chief Administrator</p>
                                          </div>
                                          <div style={{ height: '40px', width: '40px', borderRadius: '12px', backgroundColor: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#020617' }}>AR</div>
                                          <ChevronDown size={16} />
                                    </button>

                                    {isProfileOpen && (
                                          <div style={{ position: 'absolute', right: 0, top: '60px', width: '200px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '8px', zIndex: 110, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                                <button onClick={() => router.push('/login')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: '#fb7185', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                                                      <LogOut size={16} /> LOGOUT SESSION
                                                </button>
                                          </div>
                                    )}
                              </div>
                        </header>

                        <main style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '15px' : '30px' }}>
                              {children}
                        </main>
                  </div>
            </div>
      );
}