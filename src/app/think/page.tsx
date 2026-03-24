"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ensureAuth, loadMemory, updateMemory, saveEntry, getRecentEntries, saveVows, mergeThemes, refreshAvatarState, loadMessages, saveMessage, MonkMemory } from "@/lib/memory";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ThinkPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const memoryRef = useRef<MonkMemory | null>(null);
  const userIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bootstrap(); }, []);

  async function bootstrap() {
    try {
      const user = await ensureAuth();
      userIdRef.current = user.id;
      const mem = await loadMemory(user.id);
      memoryRef.current = mem;

      const storedVows  = JSON.parse(localStorage.getItem("monk_vows") ?? "[]") as string[];
      const storedAbout = localStorage.getItem("monk_about") ?? "";
      if (storedVows.some((v: string) => v.trim())) await saveVows(user.id, storedVows);
      // Sync about + vows into monk_memory so Edge Functions can access them
      await updateMemory(user.id, {
        about: storedAbout,
        vows: storedVows.filter((v: string) => v.trim()),
      });

      const prior = await loadMessages(user.id);
      if (prior.length > 0) setMessages(prior);

      setReady(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      setError(`Setup failed: ${err instanceof Error ? err.message : String(err)}`);
      setReady(true);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || thinking) return;

    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setThinking(true);
    setError("");

    if (userIdRef.current) saveMessage(userIdRef.current, "user", text);
    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const mem   = memoryRef.current;
      const vows  = JSON.parse(localStorage.getItem("monk_vows")  ?? "[]") as string[];
      const about = localStorage.getItem("monk_about") ?? "";

      const res = await fetch("/api/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          memory: {
            depth_score:          mem?.depth_score ?? 0,
            relationship_summary: mem?.relationship_summary ?? "",
            recurring_themes:     mem?.recurring_themes ?? {},
            emotional_arc:        mem?.emotional_arc ?? [],
            vows,
            about,
          },
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const { reply } = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      if (userIdRef.current) saveMessage(userIdRef.current, "assistant", reply);
      processEntry(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setThinking(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, messages, thinking]);

  async function processEntry(userText: string) {
    const userId = userIdRef.current;
    if (!userId) return;
    const mem = memoryRef.current;
    const newDepth = (mem?.depth_score ?? 0) + 1;
    const shouldRegenSummary = newDepth % 5 === 0;
    let recentEntries: Array<{ emotional_score: number; content: string }> = [];
    if (shouldRegenSummary) recentEntries = await getRecentEntries(userId, 20);

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: userText, recentEntries, currentSummary: mem?.relationship_summary ?? "", regenerateSummary: shouldRegenSummary }),
    });
    if (!res.ok) return;
    const { analysis, newSummary } = await res.json();
    await saveEntry(userId, userText, analysis.emotional_score, analysis.themes);

    const newArc    = [...(mem?.emotional_arc ?? []), analysis.emotional_score].slice(-30);
    const newThemes = mergeThemes(mem?.recurring_themes ?? {}, analysis.themes);
    const updates   = { depth_score: newDepth, emotional_arc: newArc, recurring_themes: newThemes, relationship_summary: newSummary };
    await updateMemory(userId, updates);
    const avatarState = await refreshAvatarState(userId);
    memoryRef.current = { ...mem!, ...updates, avatar_state: avatarState };
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="flex flex-col w-full" style={{ height: "100dvh", backgroundColor: "#ffffff" }}>
      {/* Top bar */}
      <div
        className="flex-shrink-0 flex items-center px-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)", paddingBottom: "16px" }}
      >
        <button
          onClick={() => router.push("/")}
          className="text-xs tracking-widest lowercase transition-colors cursor-pointer py-3 -my-3 pr-4"
          style={{ color: "rgba(0,0,0,0.3)" }}
        >
          ← back
        </button>
      </div>

      {/* Thread */}
      <div
        className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-8"
        style={{ minHeight: 0, scrollbarWidth: "none" }}
      >
        {messages.length === 0 && ready && (
          <p
            className="m-auto text-center"
            style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "13px", color: "rgba(0,0,0,0.2)", letterSpacing: "0.05em", fontStyle: "italic" }}
          >
            say something
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i}>
            {m.role === "assistant" ? (
              <p style={{ fontFamily: "var(--font-lora), Georgia, serif", fontSize: "1.25rem", lineHeight: 1.75, color: "#1a1714", margin: 0, letterSpacing: "0.01em" }}>
                {m.content}
              </p>
            ) : (
              <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "rgba(0,0,0,0.3)", margin: 0, textAlign: "right", paddingLeft: "20%" }}>
                {m.content}
              </p>
            )}
          </div>
        ))}

        {thinking && (
          <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
            {[0, 0.18, 0.36].map((delay, i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,0,0,0.2)", display: "inline-block", animation: `monkPulse 1.4s ease-in-out ${delay}s infinite` }} />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="flex-shrink-0 px-6 py-2 text-xs" style={{ color: "#a05050", background: "#fdf5f5" }}>
          {error}
        </p>
      )}

      {/* Input bar */}
      <div
        className="flex-shrink-0 flex items-end gap-3 px-6"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "12px", paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={thinking || !ready}
          rows={1}
          className="flex-1 resize-none border-none outline-none bg-transparent leading-relaxed"
          style={{ color: "#1a1714", caretColor: "#8a7f74", fontFamily: "inherit", fontSize: "16px", maxHeight: "120px", overflow: "auto" }}
          onInput={e => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }}
        />
        <button
          onClick={send}
          disabled={thinking || !input.trim()}
          style={{ width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.15)", background: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "rgba(0,0,0,0.4)", flexShrink: 0, opacity: input.trim() ? 1 : 0.3, transition: "opacity 0.2s" }}
        >
          ↑
        </button>
      </div>

      <style>{`
        @keyframes monkPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40%            { opacity: 1;   transform: scale(1); }
        }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
