"use client";

import { motion } from "framer-motion";

export default function MonkAvatar() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 select-none">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative"
      >
        {/* Glow pulse behind the monk */}
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: "var(--monk-accent)", opacity: 0.2 }}
        />

        <svg
          viewBox="0 0 200 240"
          width="180"
          height="216"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
          aria-label="Meditating monk"
        >
          <defs>
            <radialGradient id="aura" cx="50%" cy="65%" r="50%">
              <stop
                offset="0%"
                stopColor="var(--monk-accent)"
                stopOpacity="0.18"
              />
              <stop
                offset="100%"
                stopColor="var(--monk-accent)"
                stopOpacity="0"
              />
            </radialGradient>
            <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
              <stop
                offset="0%"
                stopColor="var(--monk-warm)"
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor="var(--monk-accent)"
                stopOpacity="0.75"
              />
            </radialGradient>
          </defs>

          {/* Ambient aura */}
          <ellipse
            cx="100"
            cy="160"
            rx="90"
            ry="65"
            fill="url(#aura)"
          />

          {/* Halo ring */}
          <circle
            cx="100"
            cy="42"
            r="36"
            stroke="var(--monk-warm)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.4"
          />

          {/* Head */}
          <ellipse
            cx="100"
            cy="40"
            rx="22"
            ry="24"
            fill="var(--monk-warm)"
            opacity="0.88"
          />

          {/* Face — serene closed eyes */}
          <line
            x1="90"
            y1="40"
            x2="96"
            y2="42"
            stroke="var(--monk-text)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
          <line
            x1="110"
            y1="40"
            x2="104"
            y2="42"
            stroke="var(--monk-text)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Slight smile */}
          <path
            d="M 94 50 Q 100 54 106 50"
            stroke="var(--monk-text)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />

          {/* Neck */}
          <rect
            x="92"
            y="62"
            width="16"
            height="12"
            rx="4"
            fill="var(--monk-warm)"
            opacity="0.8"
          />

          {/* Robe body — wide lotus mound */}
          <path
            d="M 70,74
               C 54,82 28,108 18,155
               Q 55,178 100,178
               Q 145,178 182,155
               C 172,108 146,82 130,74
               Q 100,66 70,74 Z"
            fill="url(#bodyGrad)"
            opacity="0.82"
          />

          {/* Robe fold lines for depth */}
          <path
            d="M 85,80 C 75,100 65,130 60,155"
            stroke="var(--monk-text)"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.12"
          />
          <path
            d="M 115,80 C 125,100 135,130 140,155"
            stroke="var(--monk-text)"
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.12"
          />

          {/* Crossed legs base */}
          <ellipse
            cx="100"
            cy="170"
            rx="82"
            ry="18"
            fill="var(--monk-accent)"
            opacity="0.6"
          />

          {/* Hands in dhyana mudra (oval in lap) */}
          <ellipse
            cx="100"
            cy="138"
            rx="26"
            ry="13"
            fill="var(--monk-warm)"
            opacity="0.78"
          />

          {/* Small circle in hands — representing the cosmic egg / awareness */}
          <circle
            cx="100"
            cy="137"
            r="5"
            fill="var(--monk-accent)"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      {/* Subtle label */}
      <p className="mt-4 text-sm text-monk-muted tracking-widest uppercase opacity-60">
        breathe
      </p>
    </div>
  );
}
