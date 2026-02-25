"use client";

import { motion } from "framer-motion";

export default function MonkAvatar() {
  return (
    <div className="flex flex-col items-center select-none" style={{ height: "32vh", aspectRatio: "4/5" }}>
      <div className="relative w-full h-full">
        {/* Outer glow — warm golden halo behind the figure */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(240,210,100,0.55) 0%, rgba(240,160,60,0.2) 50%, transparent 100%)",
          }}
        />

        {/* Floating monk */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <svg
            viewBox="0 0 180 230"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Meditating monk silhouette"
          >
            <defs>
              <linearGradient id="monk-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F8C060" />
                <stop offset="55%" stopColor="#F09030" />
                <stop offset="100%" stopColor="#C87020" />
              </linearGradient>
              <linearGradient id="monk-dark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D08030" />
                <stop offset="100%" stopColor="#A06018" />
              </linearGradient>
              <radialGradient id="monk-aura" cx="50%" cy="55%" r="50%">
                <stop offset="0%" stopColor="#FFE090" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFE090" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Inner aura disc */}
            <ellipse cx="90" cy="148" rx="85" ry="68" fill="url(#monk-aura)" />

            {/* Halo ring */}
            <circle
              cx="90" cy="50"
              r="44"
              stroke="#F8D878"
              strokeWidth="1.2"
              strokeDasharray="5 8"
              fill="none"
              opacity="0.5"
            />

            {/* Ground shadow */}
            <ellipse cx="90" cy="222" rx="58" ry="7" fill="black" opacity="0.18" />

            {/* ── BODY ── */}
            {/* Lotus legs — wide base */}
            <ellipse
              cx="90" cy="198"
              rx="68" ry="18"
              fill="url(#monk-dark)"
            />

            {/* Robe body — flowing from shoulders to legs */}
            <path
              d="M 68,88 C 44,102 22,140 16,186 Q 52,208 90,208 Q 128,208 164,186 C 158,140 136,102 112,88 Q 100,82 90,83 Q 80,82 68,88 Z"
              fill="url(#monk-gold)"
            />

            {/* Robe center highlight */}
            <path
              d="M 82,90 C 77,108 76,138 78,182 Q 90,187 102,182 C 104,138 103,108 98,90 Q 94,86 90,86 Q 86,86 82,90 Z"
              fill="white"
              opacity="0.10"
            />

            {/* Subtle robe fold */}
            <path
              d="M 74,100 C 68,125 65,158 67,188"
              stroke="#A06018" strokeWidth="1" fill="none" opacity="0.2"
              strokeLinecap="round"
            />
            <path
              d="M 106,100 C 112,125 115,158 113,188"
              stroke="#A06018" strokeWidth="1" fill="none" opacity="0.2"
              strokeLinecap="round"
            />

            {/* Hands — dhyana mudra oval */}
            <ellipse cx="90" cy="168" rx="22" ry="10" fill="#F8C870" />
            {/* Glowing orb in hands */}
            <circle cx="90" cy="167" r="5" fill="#FFE890" opacity="0.85" />
            <circle cx="90" cy="167" r="2" fill="white" opacity="0.7" />

            {/* Neck */}
            <rect x="82" y="66" width="16" height="22" rx="6" fill="#F8C060" />

            {/* Head */}
            <ellipse cx="90" cy="50" rx="27" ry="30" fill="#F8C060" />

            {/* Topknot */}
            <ellipse cx="90" cy="21" rx="10" ry="7" fill="#F8C060" />

            {/* Minimal face — closed eyes only (subtle) */}
            <path
              d="M 78,48 Q 84,44 90,48"
              stroke="#C07820" strokeWidth="1.8" fill="none"
              strokeLinecap="round" opacity="0.5"
            />
            <path
              d="M 90,48 Q 96,44 102,48"
              stroke="#C07820" strokeWidth="1.8" fill="none"
              strokeLinecap="round" opacity="0.5"
            />
            {/* Gentle smile */}
            <path
              d="M 82,60 Q 90,66 98,60"
              stroke="#C07820" strokeWidth="1.2" fill="none"
              strokeLinecap="round" opacity="0.4"
            />
          </svg>
        </motion.div>
      </div>

      {/* Breathing label */}
      <motion.p
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="text-[10px] tracking-[0.4em] uppercase text-white/50 mt-2"
      >
        breathe
      </motion.p>
    </div>
  );
}
