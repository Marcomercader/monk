"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ensureAuth, loadMemory, AvatarState } from "@/lib/memory";

const AVATAR_IMAGES: Record<AvatarState, string> = {
  thriving:   "/monk-1.png",
  stable:     "/monk-2.png",
  struggling: "/monk-3.png",
  absent:     "/monk-4.png",
};

async function registerPush(userId: string) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  if (Notification.permission === "denied") return;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  const sub = existing ?? await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });
  await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, subscription: sub.toJSON() }),
  });
}

export default function Home() {
  const router = useRouter();
  const [avatarState, setAvatarState] = useState<AvatarState>("stable");
  const [ready, setReady]             = useState(false);
  const [username, setUsername]       = useState("");

  useEffect(() => {
    const name = localStorage.getItem("monk_username");
    if (!name) { router.replace("/onboarding"); return; }
    setUsername(name);
    ensureAuth()
      .then(user => { registerPush(user.id); return loadMemory(user.id); })
      .then(mem  => { if (mem?.avatar_state) setAvatarState(mem.avatar_state as AvatarState); })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [router]);

  if (!ready) return null;

  const src = AVATAR_IMAGES[avatarState];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ height: "100dvh", backgroundColor: "#ffffff" }}
      onClick={() => router.push("/think")}
    >
      {/* monk wordmark — top center */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute left-1/2 -translate-x-1/2 text-sm font-light tracking-[0.35em] lowercase z-10"
        style={{ color: "#999", top: "calc(env(safe-area-inset-top) + 28px)" }}
      >
        monk
      </motion.p>

      {/* Settings — top right */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute right-7 z-10 p-2 cursor-pointer"
        style={{ color: "#bbb", top: "calc(env(safe-area-inset-top) + 20px)" }}
        onClick={e => { e.stopPropagation(); router.push("/settings"); }}
        aria-label="Settings"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </motion.button>

      {/* Hello name — top left */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="absolute left-7 z-10 text-xs tracking-[0.2em] lowercase"
        style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#bbb", top: "calc(env(safe-area-inset-top) + 28px)" }}
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
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 1, height: "55%", width: "200%", bottom: "-17%" }}
      />

      {/* Avatar */}
      <motion.img
        key={avatarState}
        src={src}
        alt=""
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute left-1/2 -translate-x-1/2 object-contain pointer-events-none"
        style={{
          width: avatarState === "absent" ? "14.52rem" : "13.2rem",
          bottom: "-1.5%",
          zIndex: 2,
        }}
      />
    </div>
  );
}
