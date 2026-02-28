"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Trash2 } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your ICT Assistant. Ready to explore the world of tech together? 🚀" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const clearChat = () => {
    setMessages([{ role: "bot", text: "Chat cleared! How can I help you now?" }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.text }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Oops! Connection timed out. 🔌" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.8, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-5 w-[350px] md:w-[400px] h-[550px] bg-slate-900/90 backdrop-blur-2xl border border-blue-500/20 rounded-[2.5rem] shadow-[-20px_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden ring-1 ring-white/10"
          >
            {/* Modern Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Bot size={22} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-wide">ICT HUB AI</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                    <span className="text-[10px] text-blue-100 font-medium uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="Clear Chat">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-blue-500/20">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`mt-auto p-1.5 rounded-lg ${msg.role === "user" ? "bg-blue-500" : "bg-slate-800 border border-white/5"}`}>
                      {msg.role === "user" ? <User size={12} /> : <Bot size={12} className="text-blue-400" />}
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-slate-800/50 text-gray-200 border border-white/5 rounded-bl-none backdrop-blur-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center gap-3">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-white/5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-5 bg-slate-900/50 border-t border-white/5">
              <div className="relative flex items-center gap-2 bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-1.5 focus-within:border-blue-500/50 transition-all shadow-inner">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent py-2 text-sm outline-none text-white placeholder:text-gray-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 text-blue-500 hover:text-blue-400 disabled:text-gray-600 disabled:hover:scale-100 transition-transform active:scale-90"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-600 mt-3 flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
                Powered by <Sparkles size={10} className="text-blue-500" /> Rasel ICT Hub
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-16 h-16 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl rotate-45 group-hover:rotate-[30deg] transition-all duration-500 shadow-[0_10px_30px_rgba(37,99,235,0.4)]"></div>
        <div className="relative text-white flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <MessageSquare size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}