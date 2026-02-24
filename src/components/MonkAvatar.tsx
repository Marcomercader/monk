"use client";

import { motion } from "framer-motion";

const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];

export default function MonkAvatar() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-6 select-none">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative"
      >
        {/* Larger CSS glow behind */}
        <motion.div
          animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: "var(--monk-accent)", opacity: 0.2 }}
        />

        <svg
          viewBox="0 0 280 340"
          width="240"
          height="288"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
          aria-label="Meditating monk"
        >
          <defs>
            <radialGradient id="aura2" cx="50%" cy="70%" r="50%">
              <stop offset="0%" stopColor="var(--monk-accent)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--monk-accent)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bodyGrad2" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="var(--monk-warm)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--monk-accent)" stopOpacity="0.75" />
            </radialGradient>
            <radialGradient id="platformGrad" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="var(--monk-warm)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--monk-accent)" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id="mudraGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--monk-warm)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--monk-accent)" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Ambient aura */}
          <ellipse cx="140" cy="200" rx="120" ry="80" fill="url(#aura2)" />

          {/* ── PLATFORM ── */}
          {/* Ground shadow ellipse */}
          <ellipse cx="140" cy="328" rx="90" ry="10" fill="var(--monk-accent)" opacity="0.12" />

          {/* Lotus petals around platform rim */}
          {petalAngles.map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 140 + Math.cos(rad) * 68;
            const cy = 310 + Math.sin(rad) * 14;
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx="14"
                ry="7"
                transform={`rotate(${angle}, ${cx}, ${cy})`}
                fill="var(--monk-warm)"
                opacity="0.22"
              />
            );
          })}

          {/* Platform tier 3 (bottom) */}
          <ellipse cx="140" cy="318" rx="75" ry="13" fill="url(#platformGrad)" opacity="0.55" />
          {/* Platform tier 2 (middle) */}
          <ellipse cx="140" cy="308" rx="62" ry="11" fill="url(#platformGrad)" opacity="0.65" />
          {/* Platform tier 1 (top) */}
          <ellipse cx="140" cy="300" rx="52" ry="9" fill="url(#platformGrad)" opacity="0.75" />
          {/* Top tier inner rim */}
          <ellipse
            cx="140"
            cy="300"
            rx="46"
            ry="7"
            fill="none"
            stroke="var(--monk-warm)"
            strokeWidth="0.8"
            opacity="0.4"
          />

          {/* ── MONK ── */}
          {/* Halo ring */}
          <circle
            cx="140"
            cy="55"
            r="46"
            stroke="var(--monk-warm)"
            strokeWidth="1.5"
            strokeDasharray="5 7"
            opacity="0.35"
          />

          {/* Topknot bump */}
          <ellipse cx="140" cy="22" rx="10" ry="7" fill="var(--monk-warm)" opacity="0.6" />

          {/* Head */}
          <ellipse cx="140" cy="55" rx="28" ry="30" fill="var(--monk-warm)" opacity="0.88" />

          {/* Closed-eye arcs */}
          <path
            d="M 122 55 Q 128 51 134 55"
            stroke="var(--monk-text)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
          <path
            d="M 146 55 Q 152 51 158 55"
            stroke="var(--monk-text)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />

          {/* Nose hint */}
          <path
            d="M 140 62 Q 142 66 140 68"
            stroke="var(--monk-text)"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />

          {/* Soft smile */}
          <path
            d="M 130 74 Q 140 80 150 74"
            stroke="var(--monk-text)"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />

          {/* Neck */}
          <rect x="130" y="82" width="20" height="14" rx="5" fill="var(--monk-warm)" opacity="0.8" />

          {/* Robe body */}
          <path
            d="M 100,96
               C 76,108 44,140 30,200
               Q 82,230 140,230
               Q 198,230 250,200
               C 236,140 204,108 180,96
               Q 140,86 100,96 Z"
            fill="url(#bodyGrad2)"
            opacity="0.82"
          />

          {/* Robe fold lines */}
          <path
            d="M 115,104 C 100,130 88,170 82,205"
            stroke="var(--monk-text)"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.1"
          />
          <path
            d="M 140,92 C 140,130 140,170 140,210"
            stroke="var(--monk-text)"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.08"
          />
          <path
            d="M 165,104 C 180,130 192,170 198,205"
            stroke="var(--monk-text)"
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.1"
          />

          {/* Crossed legs base */}
          <ellipse cx="140" cy="218" rx="105" ry="22" fill="var(--monk-accent)" opacity="0.55" />

          {/* Hands in dhyana mudra */}
          <ellipse cx="140" cy="185" rx="32" ry="15" fill="var(--monk-warm)" opacity="0.78" />

          {/* Mudra glow inner dot */}
          <circle cx="140" cy="184" r="7" fill="url(#mudraGlow)" opacity="0.6" />
          <circle cx="140" cy="184" r="3" fill="var(--monk-warm)" opacity="0.9" />
        </svg>
      </motion.div>

      {/* Subtle label */}
      <p className="mt-4 text-sm text-monk-muted tracking-widest uppercase opacity-60">
        breathe
      </p>
    </div>
  );
}
