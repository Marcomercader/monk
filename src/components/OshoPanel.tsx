"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OSHO_RESPONSES = [
  "Silence is the language of existence. What you seek is already within you — you only need to stop looking outward.",
  "Do not be in a hurry. The flower opens when it is ready, and the fragrance arises on its own. Trust the process of becoming.",
  "The mind is a beautiful servant but a terrible master. When you watch your thoughts without identification, you begin to taste freedom.",
  "Love is not a relationship — love is a state of being. It has nothing to do with anybody else. It is your inner quality.",
  "The present moment is the only reality. The past is memory, the future is imagination. Only now is alive, only now can you be alive.",
  "Meditation is simply the art of doing nothing. Not suppressing, not controlling — just being with what is.",
  "When you dance, you forget the dancer. When you sing, the singer disappears. This is the way to the divine — through total absorption.",
];

const GREETING = "Be still, and let us contemplate together. What stirs in your heart today?";

interface Message {
  id: string;
  role: "osho" | "user";
  text: string;
}

interface OshoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "var(--monk-warm)" }}
          animate={{ y: [0, -4, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function OshoPanel({ isOpen, onClose }: OshoPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "greeting", role: "osho", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || thinking) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    // TODO: Replace with AI API call
    setTimeout(() => {
      const response =
        OSHO_RESPONSES[Math.floor(Math.random() * OSHO_RESPONSES.length)];
      const oshoMsg: Message = {
        id: crypto.randomUUID(),
        role: "osho",
        text: response,
      };
      setMessages((prev) => [...prev, oshoMsg]);
      setThinking(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-monk-surface border-l border-monk-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-monk-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-monk-warm/30 flex items-center justify-center text-lg flex-shrink-0">
                  ☯
                </div>
                <div>
                  <p className="text-sm font-semibold text-monk-text leading-tight">Osho</p>
                  <p className="text-xs text-monk-muted">Mystic · Teacher · Guide</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-monk-muted hover:text-monk-text hover:bg-monk-bg transition-all cursor-pointer text-xl leading-none"
                aria-label="Close panel"
              >
                ×
              </button>
            </div>

            {/* Message thread */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.role === "osho"
                          ? "text-monk-text italic"
                          : "bg-monk-accent/20 text-monk-text border border-monk-accent/30"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Thinking indicator */}
              <AnimatePresence>
                {thinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl bg-monk-bg/50">
                      <ThinkingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-monk-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Osho something…"
                  disabled={thinking}
                  maxLength={300}
                  className="flex-1 bg-monk-bg text-monk-text placeholder-monk-muted text-xs px-3.5 py-2.5 rounded-full border border-monk-border focus:outline-none focus:border-monk-accent transition-colors disabled:opacity-50"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim() || thinking}
                  className="w-9 h-9 flex items-center justify-center bg-monk-accent text-white rounded-full disabled:opacity-40 transition-opacity cursor-pointer flex-shrink-0"
                  aria-label="Send"
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                    <path d="M2 8l12-6-6 12V9L2 8z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
