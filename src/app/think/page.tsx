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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Bootstrap auth + memory ───────────────────────────────────────────────
  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    try {
      const user = await ensureAuth();
      userIdRef.current = user.id;
      const mem = await loadMemory(user.id);
      memoryRef.current = mem;

      // Sync vows from localStorage into Supabase on first load
      const storedVows = JSON.parse(localStorage.getItem("monk_vows") ?? "[]") as string[];
      if (storedVows.some((v: string) => v.trim())) {
        await saveVows(user.id, storedVows);
      }

      // Load previous conversation from Supabase
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

  // ── Send message ──────────────────────────────────────────────────────────
  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || thinking) return;

    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setThinking(true);
    setError("");

    // Persist user message to Supabase
    if (userIdRef.current) saveMessage(userIdRef.current, "user", text);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const mem = memoryRef.current;
      const vows = JSON.parse(localStorage.getItem("monk_vows") ?? "[]") as string[];

      const res = await fetch("/api/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          memory: {
            depth_score: mem?.depth_score ?? 0,
            relationship_summary: mem?.relationship_summary ?? "",
            recurring_themes: mem?.recurring_themes ?? {},
            emotional_arc: mem?.emotional_arc ?? [],
            vows,
          },
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const { reply } = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      // Persist monk reply to Supabase
      if (userIdRef.current) saveMessage(userIdRef.current, "assistant", reply);

      // Background: analyze + persist
      processEntry(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setThinking(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, messages, thinking]);

  // ── Background: analyze entry, update memory ──────────────────────────────
  async function processEntry(userText: string) {
    const userId = userIdRef.current;
    if (!userId) return;

    const mem = memoryRef.current;
    const newDepth = (mem?.depth_score ?? 0) + 1;
    const shouldRegenSummary = newDepth % 5 === 0;

    let recentEntries: Array<{ emotional_score: number; content: string }> = [];
    if (shouldRegenSummary) {
      recentEntries = await getRecentEntries(userId, 20);
    }

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: userText,
        recentEntries,
        currentSummary: mem?.relationship_summary ?? "",
        regenerateSummary: shouldRegenSummary,
      }),
    });

    if (!res.ok) return;
    const { analysis, newSummary } = await res.json();

    await saveEntry(userId, userText, analysis.emotional_score, analysis.themes);

    const newArc = [...(mem?.emotional_arc ?? []), analysis.emotional_score].slice(-30);
    const newThemes = mergeThemes(mem?.recurring_themes ?? {}, analysis.themes);

    const updates = {
      depth_score: newDepth,
      emotional_arc: newArc,
      recurring_themes: newThemes,
      relationship_summary: newSummary,
    };

    await updateMemory(userId, updates);

    // Recalculate and persist avatar state after every entry
    const avatarState = await refreshAvatarState(userId);
    memoryRef.current = { ...mem!, ...updates, avatar_state: avatarState };
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: "#f0ede8" }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: "min(100vw, 390px)",
          height: "min(100vh, 844px)",
          backgroundColor: "#ffffff",
          borderRadius: "clamp(0px, 4vw, 44px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-6 flex-shrink-0">
          <button
            onClick={() => router.push("/")}
            className="text-xs tracking-widest lowercase transition-colors cursor-pointer"
            style={{ color: "rgba(0,0,0,0.3)" }}
          >
            ← back
          </button>
        </div>

        {/* Thread */}
        <div
          className="flex-1 overflow-y-auto px-8 pb-4 flex flex-col gap-8"
          style={{ minHeight: 0, scrollbarWidth: "none" }}
        >
          {messages.length === 0 && ready && (
            <p
              className="m-auto text-center"
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "13px",
                color: "rgba(0,0,0,0.2)",
                letterSpacing: "0.05em",
                fontStyle: "italic",
              }}
            >
              say something
            </p>
          )}

          {messages.map((m, i) => (
            <div key={i}>
              {m.role === "assistant" ? (
                <p
                  style={{
                    fontFamily: "var(--font-lora), Georgia, serif",
                    fontSize: "1.3rem",
                    lineHeight: 1.7,
                    color: "#1a1714",
                    margin: 0,
                    letterSpacing: "0.01em",
                  }}
                >
                  {m.content}
                </p>
              ) : (
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    color: "rgba(0,0,0,0.3)",
                    margin: 0,
                    textAlign: "right",
                    paddingLeft: "20%",
                  }}
                >
                  {m.content}
                </p>
              )}
            </div>
          ))}

          {thinking && (
            <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "4px 0" }}>
              {[0, 0.18, 0.36].map((delay, i) => (
                <span
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.2)",
                    display: "inline-block",
                    animation: `monkPulse 1.4s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {error && (
          <p
            className="px-8 py-2 text-xs flex-shrink-0"
            style={{ color: "#a05050", background: "#fdf5f5" }}
          >
            {error}
          </p>
        )}

        {/* Input bar */}
        <div
          className="flex-shrink-0 flex items-end gap-3 px-8 pb-8 pt-3"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={thinking || !ready}
            rows={1}
            className="flex-1 resize-none border-none outline-none bg-transparent text-sm leading-relaxed"
            style={{
              color: "#1a1714",
              caretColor: "#8a7f74",
              fontFamily: "inherit",
              maxHeight: "120px",
              overflow: "auto",
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
          />
          <button
            onClick={send}
            disabled={thinking || !input.trim()}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.15)",
              background: "none",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              color: "rgba(0,0,0,0.4)",
              flexShrink: 0,
              opacity: input.trim() ? 1 : 0.3,
              transition: "opacity 0.2s",
            }}
          >
            ↑
          </button>
        </div>
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
