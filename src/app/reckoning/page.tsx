"use client";

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ensureAuth } from "@/lib/memory";

interface ReckoningData {
  id: string;
  narrative: string;
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function ReckoningPage() {
  const router = useRouter();
  const [data, setData] = useState<ReckoningData | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    ensureAuth()
      .then(async (user) => {
        userIdRef.current = user.id;
        const res = await fetch(`/api/reckoning?userId=${user.id}`);
        const json = await res.json();
        if (!json.pending) {
          setNotFound(true);
          setReady(true);
          return;
        }
        setData({ id: json.id, narrative: json.narrative });
        setParagraphs(splitParagraphs(json.narrative));
        setReady(true);
      })
      .catch(() => {
        setNotFound(true);
        setReady(true);
      });
  }, []);

  async function handleClose() {
    if (data && userIdRef.current) {
      await fetch("/api/reckoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userIdRef.current, notificationId: data.id }),
      });
    }
    router.push("/");
  }

  if (!ready) return null;

  if (notFound) {
    return (
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{ height: "100dvh", backgroundColor: "#000", color: "rgba(255,255,255,0.2)" }}
      >
        <p style={{ fontSize: "13px", letterSpacing: "0.1em", fontFamily: "Georgia, serif" }}>
          nothing awaits
        </p>
        <button
          onClick={() => router.push("/")}
          style={{ marginTop: "32px", fontSize: "12px", color: "rgba(255,255,255,0.2)", cursor: "pointer", background: "none", border: "none", letterSpacing: "0.15em" }}
        >
          ← back
        </button>
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col"
      style={{ height: "100dvh", backgroundColor: "#000", overflow: "hidden" }}
    >
      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", paddingTop: "calc(env(safe-area-inset-top) + 48px)" }}
      >
        <div
          className="mx-auto flex flex-col items-center"
          style={{ maxWidth: "640px", padding: "0 28px 120px" }}
        >
          {/* Avatar */}
          <motion.img
            src="/monk-4.png"
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ width: 60, height: 60, objectFit: "contain", marginBottom: "28px" }}
          />

          {/* Title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.3 }}
            style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: "48px",
              fontFamily: "Georgia, serif",
            }}
          >
            The Reckoning
          </motion.p>

          {/* Narrative paragraphs — staggered fade-in */}
          <AnimatePresence>
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.2, ease: "easeOut" }}
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "1.0625rem",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.82)",
                  marginBottom: i < paragraphs.length - 1 ? "1.75em" : 0,
                  textAlign: "left",
                  width: "100%",
                }}
              >
                {para}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Close button — fixed at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="flex-shrink-0 flex justify-center"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 28px)",
          paddingTop: "16px",
          background: "linear-gradient(to bottom, transparent, #000 40%)",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.25)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "12px 24px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
        >
          →
        </button>
      </motion.div>

      <style>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
