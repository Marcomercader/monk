"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThinkPage() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: "#f0ede8" }}>
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
      <div className="flex items-center justify-between px-8 py-6">
        <button
          onClick={() => router.push("/")}
          className="text-xs tracking-widest lowercase text-black/30 hover:text-black/60 transition-colors cursor-pointer"
        >
          ← back
        </button>
        <div className="flex-1" />
      </div>

      {/* Main area */}
      <div className="flex-1 flex items-start justify-center px-8 pb-8 gap-6">

        {/* Centered textarea */}
        <div className="flex-1 max-w-xl h-full">
          <textarea
            ref={ref}
            className="w-full h-full resize-none border-none outline-none text-base font-light leading-relaxed bg-white"
            style={{ color: "#111", caretColor: "#111" }}
          />
        </div>

        {/* Voice button — right side */}
        <div className="flex flex-col items-center justify-start pt-1">
          <button
            className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center cursor-pointer hover:border-black/30 transition-colors"
            aria-label="Voice message"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" fill="black" opacity="0.4" />
              <path d="M5 11a7 7 0 0 0 14 0" stroke="black" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.4" />
              <line x1="12" y1="18" x2="12" y2="22" stroke="black" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
              <line x1="9" y1="22" x2="15" y2="22" stroke="black" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
            </svg>
          </button>
          <span className="text-[10px] text-black/20 tracking-widest lowercase mt-2">voice</span>
        </div>

      </div>
    </div>
    </div>
  );
}
