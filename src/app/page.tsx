"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MONK_STATES = [
  { id: "1", label: "1", src: "/monk-1.png" },
  { id: "2", label: "2", src: "/monk-2.png" },
  { id: "3", label: "3", src: "/monk-3.png" },
  { id: "4", label: "4", src: "/monk-4.png" },
];

export default function Home() {
  const router = useRouter();
  const [activeState, setActiveState] = useState("1");
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("monk_username");
    if (!name) {
      router.replace("/onboarding");
    } else {
      setUsername(name);
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  const currentMonk = MONK_STATES.find((s) => s.id === activeState) ?? MONK_STATES[0];

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: "#f0ede8" }}>
      {/* Phone frame */}
      <div
        className="relative overflow-hidden select-none"
        style={{
          width: "min(100vw, 390px)",
          height: "min(100vh, 844px)",
          backgroundColor: "#ffffff",
          borderRadius: "clamp(0px, 4vw, 44px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        {/* monk wordmark — top center */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute top-7 left-1/2 -translate-x-1/2 text-sm font-light tracking-[0.35em] lowercase cursor-pointer z-10"
          style={{ color: "#999" }}
          onClick={() => router.push("/think")}
        >
          monk
        </motion.p>

        {/* Settings button — top right */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute top-6 right-7 z-10 cursor-pointer p-1"
          style={{ color: "#bbb" }}
          onClick={() => router.push("/settings")}
          aria-label="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </motion.button>

        {/* State radio buttons — right side */}
        <div className="absolute right-7 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
          {MONK_STATES.map((state) => (
            <label key={state.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="monk-state"
                value={state.id}
                checked={activeState === state.id}
                onChange={() => setActiveState(state.id)}
                className="accent-[#bbb]"
              />
              <span className="text-[11px] tracking-[0.25em] lowercase" style={{ color: "#bbb" }}>
                {state.label}
              </span>
            </label>
          ))}
        </div>

        {/* Hello name — top left */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="absolute top-7 left-8 z-10 text-xs tracking-[0.2em] lowercase"
          style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#bbb" }}
        >
          hello {username}
        </motion.p>

        {/* Platform / mountain */}
        <motion.img
          src="/platform-1.png"
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ zIndex: 1, height: "55%", width: "200%", bottom: "-17%" }}
        />

        {/* Avatar */}
        <motion.img
          key={activeState}
          src={currentMonk.src}
          alt=""
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 object-contain pointer-events-none"
          style={{ width: activeState === "4" ? "14.52rem" : "13.2rem", zIndex: 2 }}
        />

        {/* Clickable overlay */}
        <div
          className="absolute inset-0 z-0 cursor-pointer"
          onClick={() => router.push("/think")}
        />
      </div>
    </div>
  );
}
