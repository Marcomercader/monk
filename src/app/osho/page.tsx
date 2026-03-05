"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const OSHO_RESPONSES = [
  "Silence is the language of existence. What you seek is already within you — you only need to stop looking outward.",
  "Do not be in a hurry. The flower opens when it is ready, and the fragrance arises on its own. Trust the process of becoming.",
  "The mind is a beautiful servant but a terrible master. When you watch your thoughts without identification, you begin to taste freedom.",
  "Love is not a relationship — love is a state of being. It has nothing to do with anybody else. It is your inner quality.",
  "The present moment is the only reality. The past is memory, the future is imagination. Only now is alive, only now can you be alive.",
  "Meditation is simply the art of doing nothing. Not suppressing, not controlling — just being with what is.",
  "When you dance, you forget the dancer. When you sing, the singer disappears. This is the way to the divine — through total absorption.",
  "You are not the body, you are not the mind. You are the witness — the pure awareness that watches it all.",
  "Drop the idea of becoming someone. You already are. Relax into being.",
  "Laughter is prayer. Whenever you laugh, you are closer to existence than when you are serious.",
];

const GREETING = "Be still, and let us contemplate together. What stirs in your heart today?";

interface Message {
  id: string;
  role: "osho" | "user";
  text: string;
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--monk-warm)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function OshoPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "osho", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || thinking) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: trimmed }]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const response = OSHO_RESPONSES[Math.floor(Math.random() * OSHO_RESPONSES.length)];
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "osho", text: response }]);
      setThinking(false);
    }, 1600);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-monk-bg text-monk-text">

      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-monk-border bg-monk-surface/60 backdrop-blur-sm flex-shrink-0">
        <Link href="/">
          <motion.span
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 text-monk-muted hover:text-monk-text transition-colors text-sm cursor-pointer"
          >
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            monk
          </motion.span>
        </Link>
        <span className="text-monk-border text-xs">|</span>
        <span className="text-base font-light tracking-widest lowercase text-monk-text">osho</span>
      </header>

      {/* Body: avatar left, chat right */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Avatar ── */}
        <div className="hidden md:flex w-[38%] flex-col items-center justify-end pb-10 px-8 border-r border-monk-border bg-monk-surface/30 relative overflow-hidden">
          {/* Glow */}
          <motion.div
            animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(196,168,130,0.25) 0%, transparent 70%)",
            }}
          />

          {/* Avatar image */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative z-10 w-full max-w-xs"
          >
            {/* Placeholder — replace /osho.PNG once uploaded */}
            <div className="w-full aspect-[3/4] flex items-end justify-center">
              <img
                src="/osho.PNG"
                alt="Osho"
                className="w-full h-full object-contain drop-shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </motion.div>

          {/* Name */}
          <div className="relative z-10 text-center mt-6">
            <p className="text-2xl font-light tracking-[0.2em] text-monk-text lowercase">osho</p>
            <p className="text-xs text-monk-muted tracking-widest mt-1">Mystic · Teacher · Guide</p>
          </div>
        </div>

        {/* ── RIGHT: Chat ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "osho" && (
                    <div className="w-7 h-7 rounded-full bg-monk-warm/40 border border-monk-border flex items-center justify-center text-sm flex-shrink-0 mr-3 mt-0.5">
                      ☯
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "osho"
                        ? "bg-monk-surface border border-monk-border text-monk-text italic"
                        : "bg-monk-accent/20 border border-monk-accent/30 text-monk-text"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-7 h-7 rounded-full bg-monk-warm/40 border border-monk-border flex items-center justify-center text-sm flex-shrink-0 mr-3 mt-0.5">
                    ☯
                  </div>
                  <div className="bg-monk-surface border border-monk-border rounded-2xl">
                    <ThinkingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-monk-border flex-shrink-0 bg-monk-surface/40">
            <div className="flex items-center gap-3 max-w-2xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Speak to Osho…"
                disabled={thinking}
                maxLength={300}
                className="flex-1 bg-monk-bg text-monk-text placeholder-monk-muted text-sm px-4 py-3 rounded-full border border-monk-border focus:outline-none focus:border-monk-accent transition-colors disabled:opacity-50"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!input.trim() || thinking}
                className="w-11 h-11 flex items-center justify-center bg-monk-accent text-white rounded-full disabled:opacity-40 transition-opacity cursor-pointer flex-shrink-0"
                aria-label="Send"
              >
                <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
                  <path d="M2 8l12-6-6 12V9L2 8z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
