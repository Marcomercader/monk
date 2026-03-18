"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "monk_osho_history";
const GREETING = "Be still, and let us contemplate together. What stirs in your heart today?";

async function silentlyEvaluate(messages: Message[]) {
  const history = messages
    .filter((m) => m.id !== "greeting")
    .map((m) => ({ role: m.role === "osho" ? "assistant" : "user", content: m.text }));
  if (history.length < 2) return;
  try {
    const res = await fetch("/api/osho/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const { score } = await res.json();
    localStorage.setItem("monk_score", String(score));
    window.dispatchEvent(new CustomEvent("monk_score_change", { detail: { score } }));
  } catch {}
}

interface Message {
  id: string;
  role: "osho" | "user";
  text: string;
}

interface OshoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function parseScore(text: string): { isScore: boolean; score?: number; explanation?: string } {
  const match = text.match(/^SCORE:\s*([1-5])\s*\n+([\s\S]+)$/);
  if (!match) return { isScore: false };
  return { isScore: true, score: parseInt(match[1]), explanation: match[2].trim() };
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 rounded-full bg-black/25"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function OshoPanel({ isOpen, onClose }: OshoPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [latestResponse, setLatestResponse] = useState<Message | null>(null);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyBottomRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const loaded: Message[] = JSON.parse(saved);
        setMessages(loaded);
        silentlyEvaluate(loaded);
      } else {
        setMessages([{ id: "greeting", role: "osho", text: GREETING }]);
      }
    } catch {
      setMessages([{ id: "greeting", role: "osho", text: GREETING }]);
    }
  }, []);

  // Persist
  useEffect(() => {
    if (messages.length === 0) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  // Scroll history to bottom
  useEffect(() => {
    if (historyOpen) {
      setTimeout(() => historyBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [historyOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || thinking) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setThinking(true);
    setLatestResponse(null);

    try {
      const history = updatedMessages
        .filter((m) => m.id !== "greeting")
        .map((m) => ({ role: m.role === "osho" ? "assistant" : "user", content: m.text }));

      const res = await fetch("/api/osho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const oshoMsg: Message = { id: crypto.randomUUID(), role: "osho", text: data.text };
      const finalMessages = [...updatedMessages, oshoMsg];
      setMessages(finalMessages);
      setLatestResponse(oshoMsg);
      // Only evaluate every 3 exchanges to conserve API tokens
      const userMsgCount = finalMessages.filter((m) => m.role === "user").length;
      if (userMsgCount % 3 === 0) silentlyEvaluate(finalMessages);
    } catch {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "osho",
        text: "The river is still. Ask again in a moment.",
      };
      setMessages((prev) => [...prev, errMsg]);
      setLatestResponse(errMsg);
    } finally {
      setThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const parsed = latestResponse ? parseScore(latestResponse.text) : { isScore: false };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 bg-white z-50 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── TOP BAR ── */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="font-handwriting text-lg text-black/30 hover:text-black/55 transition-colors cursor-pointer"
            >
              ← back
            </button>
            <span className="text-lg font-light tracking-[0.3em] text-black/30 lowercase select-none">
              monk
            </span>
            <button
              onClick={() => setHistoryOpen(true)}
              className="font-handwriting text-lg text-black/30 hover:text-black/55 transition-colors cursor-pointer"
            >
              past
            </button>
          </div>

          {/* ── MAIN CANVAS — centered input ── */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 md:px-20 lg:px-36">

            {/* Latest response — scrollable from top, capped height */}
            <div className="w-full max-w-lg mb-8 min-h-[4rem] max-h-[50vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {thinking ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ThinkingDots />
                  </motion.div>
                ) : latestResponse ? (
                  <motion.div
                    key={latestResponse.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    {parsed.isScore ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <div key={n} className={`w-1.5 h-1.5 rounded-full ${n <= parsed.score! ? "bg-black/50" : "bg-black/10"}`} />
                            ))}
                          </div>
                          <span className="font-handwriting text-sm text-black/30">{parsed.score} / 5</span>
                        </div>
                        <p className="font-handwriting text-base text-black/55 leading-snug italic">
                          {parsed.explanation}
                        </p>
                      </div>
                    ) : (
                      <p className="font-handwriting text-base text-black/55 leading-snug italic">
                        {latestResponse.text}
                      </p>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Input line */}
            <div className="w-full max-w-lg border-b border-black/12 pb-2 flex items-center gap-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="write something…"
                disabled={thinking}
                maxLength={300}
                className="font-handwriting flex-1 bg-transparent text-base text-black/60 placeholder-black/18 focus:outline-none disabled:opacity-40"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || thinking}
                className="font-handwriting text-lg text-black/25 hover:text-black/50 transition-colors disabled:opacity-20 cursor-pointer flex-shrink-0"
              >
                send
              </button>
            </div>
          </div>

          {/* ── HISTORY OVERLAY ── */}
          <AnimatePresence>
            {historyOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-white z-10 flex flex-col"
              >
                {/* History top bar */}
                <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="font-handwriting text-lg text-black/30 hover:text-black/55 transition-colors cursor-pointer"
                  >
                    ← close
                  </button>
                  <span className="font-handwriting text-lg text-black/30">past conversations</span>
                  <div className="w-12" />
                </div>

                {/* History messages */}
                <div className="flex-1 overflow-y-auto px-8 md:px-20 lg:px-36 py-4 space-y-4">
                  {messages.filter((m) => m.id !== "greeting").slice(-10).map((msg) => {
                    const p = msg.role === "osho" ? parseScore(msg.text) : { isScore: false };
                    if (p.isScore) {
                      return (
                        <div key={msg.id} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <div key={n} className={`w-1.5 h-1.5 rounded-full ${n <= p.score! ? "bg-black/40" : "bg-black/8"}`} />
                              ))}
                            </div>
                            <span className="font-handwriting text-sm text-black/25">{p.score} / 5</span>
                          </div>
                          <p className="font-handwriting text-sm text-black/45 italic leading-snug">{p.explanation}</p>
                        </div>
                      );
                    }
                    if (msg.role === "osho") {
                      return (
                        <p key={msg.id} className="font-handwriting text-sm text-black/45 italic leading-snug">
                          {msg.text}
                        </p>
                      );
                    }
                    return (
                      <div key={msg.id} className="flex justify-end">
                        <p className="font-handwriting text-sm text-black/30 leading-snug text-right max-w-xs">
                          {msg.text}
                        </p>
                      </div>
                    );
                  })}
                  <div ref={historyBottomRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
