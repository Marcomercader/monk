"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Entry {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const STORAGE_KEY = "monk_think_entries";

// Browser speech recognition
const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  const W = window as unknown as Record<string, unknown>;
  const SR = (W.SpeechRecognition ?? W.webkitSpeechRecognition) as (new () => SpeechRecognition) | undefined;
  return SR ? new SR() : null;
};

export default function ThinkPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);   // AI is playing TTS
  const [recording, setRecording] = useState(false); // mic is active
  const [transcript, setTranscript] = useState("");  // live transcript while recording

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load saved entries
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setEntries(JSON.parse(saved));
    } catch {}
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (entries.length > 0)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, loading, transcript]);

  // ── speak AI response via TTS ──────────────────────────────
  const speakText = useCallback(async (text: string) => {
    setSpeaking(true);
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  }, []);

  // ── send text to AI ────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userEntry: Entry = { id: crypto.randomUUID(), role: "user", text };
    const next = [...entries, userEntry];
    setEntries(next);
    setInput("");
    setLoading(true);

    try {
      const messages = next.map((e) => ({ role: e.role, content: e.text }));
      const res = await fetch("/api/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (data.reply) {
        const assistantEntry: Entry = { id: crypto.randomUUID(), role: "assistant", text: data.reply };
        setEntries((prev) => [...prev, assistantEntry]);
        speakText(data.reply);
      }
    } catch {
      setEntries((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }, [entries, loading, speakText]);

  // ── mic: start recording ───────────────────────────────────
  const startRecording = useCallback(() => {
    if (recording || loading || speaking) return;

    // Stop any playing audio
    if (audioRef.current) { audioRef.current.pause(); setSpeaking(false); }

    const recognition = getSpeechRecognition();
    if (!recognition) {
      alert("Your browser doesn't support speech recognition. Try Chrome.");
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setRecording(true);
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map((r) => r[0].transcript).join("");
      setTranscript(t);
    };
    recognition.onend = () => {
      setRecording(false);
      const final = transcript || "";
      setTranscript("");
      if (final.trim()) sendMessage(final.trim());
    };
    recognition.onerror = () => { setRecording(false); setTranscript(""); };

    recognitionRef.current = recognition;
    recognition.start();
  }, [recording, loading, speaking, transcript, sendMessage]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  // ── text submit ────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const micLabel = recording ? "listening…" : speaking ? "speaking…" : loading ? "thinking…" : "hold to speak";
  const micActive = recording;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">

      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 right-8 text-xs text-black/25 hover:text-black/60 transition-colors cursor-pointer tracking-widest lowercase z-10"
      >
        esc
      </button>

      <div className="flex-1 max-w-2xl w-full mx-auto px-8 pt-14 pb-52 flex flex-col gap-8">

        {/* Text input */}
        <div className="flex flex-col gap-0">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="what's on your mind"
            rows={1}
            disabled={loading || recording || speaking}
            className="w-full resize-none bg-transparent text-black text-lg font-light placeholder-black/20 focus:outline-none leading-relaxed disabled:opacity-40"
            style={{ overflow: "hidden" }}
            onInput={(e) => {
              const el = e.target as HTMLTextAreaElement;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
          />
          {input.trim() && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-black/20 mt-1">
              ↵ enter to send · shift+enter for new line
            </motion.p>
          )}
        </div>

        {entries.length > 0 && <div className="border-t border-black/8" />}

        {/* Entries */}
        <div className="flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={entry.role === "user" ? "text-black" : "text-black/45"}
              >
                <p className={`text-base font-light leading-relaxed ${entry.role === "assistant" ? "italic" : ""}`}>
                  {entry.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Live transcript while recording */}
          <AnimatePresence>
            {transcript && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-base font-light text-black/30 italic"
              >
                {transcript}
              </motion.p>
            )}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 h-1 rounded-full bg-black/25 inline-block"
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Mic button — fixed bottom center ── */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <AnimatePresence>
          {(recording || speaking || loading) && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] text-black/30 tracking-widest lowercase"
            >
              {micLabel}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
          onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
          disabled={loading || speaking}
          animate={micActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={micActive ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } : {}}
          className="w-14 h-14 rounded-full border border-black/15 flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
          style={{ background: micActive ? "black" : "white" }}
          aria-label="Hold to speak"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3"
              fill={micActive ? "white" : "black"} />
            <path d="M5 11a7 7 0 0 0 14 0" stroke={micActive ? "white" : "black"}
              strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <line x1="12" y1="18" x2="12" y2="22"
              stroke={micActive ? "white" : "black"} strokeWidth="1.6" strokeLinecap="round" />
            <line x1="9" y1="22" x2="15" y2="22"
              stroke={micActive ? "white" : "black"} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
