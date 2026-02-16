"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Eye, EyeOff, ShieldAlert, Lock, User, Terminal, X } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

function LoginContent() {
      const searchParams = useSearchParams();
      const router = useRouter();
      const role = searchParams.get("role") || "student";
      
      //added close button to return home page
      const handleClose = () => {
            router.push("/");
      }

      const [identifier, setIdentifier] = useState("");
      const [password, setPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [message, setMessage] = useState({ type: "", text: "" });
      const [loading, setLoading] = useState(false);

      const handleLogin = async (e) => {
            e.preventDefault();
            setLoading(true);
            setMessage({ type: "", text: "" });

            try {
                  const res = await fetch("/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ identifier, password, role }),
                  });

                  const data = await res.json();

                  if (data.success) {
                        // ✅ আইডি অবজেক্ট সমস্যা ফিক্স করা (Clean ID for LocalStorage)
                        const userData = {
                              ...data.user,
                              _id: data.user._id?.$oid || data.user._id // সরাসরি স্ট্রিং আইডি রাখা
                        };

                        localStorage.setItem("user", JSON.stringify(userData));

                        setMessage({ type: "success", text: `ACCESS GRANTED (${role.toUpperCase()}). REDIRECTING...` });

                        confetti({
                              particleCount: 150,
                              spread: 70,
                              origin: { y: 0.6 },
                              colors: ["#00ff00", "#ffffff", "#008000"],
                        });

                        // ২ সেকেন্ড পর হার্ড রিডাইরেক্ট (লুপ ব্রেক করার জন্য window.location ব্যবহার)
                        setTimeout(() => {
                              const target = role === "admin" ? "/admin-dashboard" : "/student-dashboard";
                              window.location.href = target;
                        }, 2000);

                  } else {
                        setMessage({ type: "error", text: data.message || "ACCESS DENIED: INVALID CREDENTIALS" });
                  }
            } catch (error) {
                  setMessage({ type: "error", text: "SYSTEM ERROR: BREACH FAILED" });
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen bg-black text-green-500 flex items-center justify-center p-4 font-mono relative overflow-hidden">
                  <ParticlesBackground />

                  {/* Scanning Animation Line */}
                  <motion.div
                        animate={{ y: ["0vh", "100vh"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-1 bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10 pointer-events-none"
                  />

                  <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-green-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,255,0,0.1)] relative z-20"
                  >
                        {/* --- CLOSE BUTTON START --- */}
                        <button 
                              onClick={handleClose}
                              className="absolute top-4 right-4 text-green-500/50 hover:text-green-400 hover:bg-green-500/10 p-1 rounded-full transition-all group"
                              title="Close Portal"
                        >
                              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                        {/* --- CLOSE BUTTON END --- */}

                        <div className="text-center mb-8">
                              <Terminal className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                              <h2 className="text-2xl font-bold tracking-widest uppercase italic text-green-400">
                                    {role === "admin" ? "Admin Portal" : "Student Portal"}
                              </h2>
                              <p className="text-xs text-green-500/60 mt-1 uppercase">
                                    Status: {role} verification active
                              </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                              <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-green-500/50" />
                                    <input
                                          type="text"
                                          placeholder="EMAIL OR PHONE"
                                          className="w-full bg-black/50 border border-green-500/20 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:border-green-500 transition-all text-sm tracking-widest uppercase placeholder:text-green-900"
                                          value={identifier}
                                          onChange={(e) => setIdentifier(e.target.value)}
                                          required
                                    />
                              </div>

                              <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-green-500/50" />
                                    <input
                                          type={showPassword ? "text" : "password"}
                                          placeholder="ACCESS CODE"
                                          className="w-full bg-black/50 border border-green-500/20 rounded-lg py-3 pl-12 pr-12 focus:outline-none focus:border-green-500 transition-all text-sm tracking-widest placeholder:text-green-900"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          required
                                    />
                                    <button
                                          type="button"
                                          onClick={() => setShowPassword(!showPassword)}
                                          className="absolute right-3 top-3 text-green-500/50 hover:text-green-500"
                                    >
                                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                              </div>

                              <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2 uppercase tracking-tighter disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                    {loading ? "Decrypting..." : "Initiate Login"}
                              </button>
                        </form>

                        {message.text && (
                              <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className={`mt-6 p-3 rounded border text-center text-xs flex items-center justify-center gap-2 ${message.type === "success"
                                          ? "bg-green-500/10 border-green-500 text-green-400"
                                          : "bg-red-500/10 border-red-500 text-red-500"
                                          }`}
                              >
                                    {message.type === "error" && <ShieldAlert className="w-4 h-4" />}
                                    {message.text}
                              </motion.div>
                        )}
                  </motion.div>
            </div>
      );
}

export default function LoginPage() {
      return (
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-green-500">BOOTING SYSTEM...</div>}>
                  <LoginContent />
            </Suspense>
      );
}