"use client";

import { motion } from "framer-motion";

export default function MonkAvatar() {
  return (
    <div className="flex flex-col items-center select-none">
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="relative"
      >
        {/* Soft glow behind the scene */}
        <motion.div
          animate={{ opacity: [0.12, 0.32, 0.12], scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          className="absolute inset-x-0 bottom-4 h-2/3 rounded-full blur-3xl"
          style={{ background: "var(--monk-accent)" }}
        />

        <svg
          viewBox="0 0 300 340"
          width="300"
          height="340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
          aria-label="Meditating monk on mountain"
        >
          <defs>
            <linearGradient id="tla-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9EC4DA" />
              <stop offset="60%" stopColor="#C8D8E4" />
              <stop offset="100%" stopColor="#DDD0B8" />
            </linearGradient>
            <linearGradient id="tla-robe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2A030" />
              <stop offset="100%" stopColor="#D47818" />
            </linearGradient>
            <linearGradient id="tla-rock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A09080" />
              <stop offset="100%" stopColor="#5E4832" />
            </linearGradient>
            <linearGradient id="tla-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A89070" />
              <stop offset="100%" stopColor="#7A6048" />
            </linearGradient>
            <clipPath id="scene-clip">
              <rect x="0" y="0" width="300" height="340" rx="16" />
            </clipPath>
          </defs>

          <g clipPath="url(#scene-clip)">
            {/* ── SKY ── */}
            <rect x="0" y="0" width="300" height="340" fill="url(#tla-sky)" />

            {/* ── FAR MOUNTAINS (pale, distant) ── */}
            <polygon points="10,295 90,162 170,295" fill="#8DACC4" opacity="0.65" />
            <polygon points="128,295 210,148 292,295" fill="#7A9EBC" opacity="0.6" />
            {/* Snow caps */}
            <polygon points="55,196 90,162 125,196" fill="white" opacity="0.48" />
            <polygon points="174,183 210,148 246,183" fill="white" opacity="0.42" />

            {/* ── NEAR MOUNTAINS (darker, flanking) ── */}
            <polygon points="-4,322 62,232 128,322" fill="#64788A" />
            <polygon points="172,322 238,225 304,322" fill="#5C6E80" />

            {/* ── GROUND STRIP ── */}
            <rect x="0" y="310" width="300" height="30" fill="url(#tla-ground)" />
            {/* Ground edge line */}
            <line x1="0" y1="310" x2="300" y2="310" stroke="#3D2A1A" strokeWidth="1.5" opacity="0.4" />

            {/* ── SIDE ROCKS ── */}
            <polygon
              points="52,318 46,302 62,292 78,298 76,318"
              fill="#8A7A68" stroke="#3D2A1A" strokeWidth="1.5" strokeLinejoin="round"
            />
            <polygon
              points="248,318 224,300 238,290 252,296 254,318"
              fill="#8A7A68" stroke="#3D2A1A" strokeWidth="1.5" strokeLinejoin="round"
            />

            {/* ── MAIN ROCK PLATFORM ── */}
            <path
              d="M 98,308 L 90,292 L 98,276 L 114,270 L 136,266 L 150,264 L 164,266 L 186,270 L 202,276 L 210,292 L 202,308 Z"
              fill="url(#tla-rock)" stroke="#3D2A1A" strokeWidth="2.5" strokeLinejoin="round"
            />
            {/* Rock highlight */}
            <path
              d="M 114,270 L 136,266 L 150,264 L 164,266 L 186,270 L 182,274 L 150,270 L 118,274 Z"
              fill="white" opacity="0.14"
            />
            {/* Rock crevice lines */}
            <path d="M 130,284 L 122,296 L 118,308" stroke="#3D2A1A" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
            <path d="M 170,282 L 178,295 L 180,308" stroke="#3D2A1A" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

            {/* ── MONK ── */}

            {/* Meditation aura — dashed halo behind monk */}
            <circle
              cx="150" cy="165" r="105"
              stroke="#C4A882" strokeWidth="1.5" strokeDasharray="6 9"
              opacity="0.22"
            />
            {/* Inner glow disc */}
            <ellipse cx="150" cy="200" rx="72" ry="50" fill="var(--monk-warm)" opacity="0.07" />

            {/* ROBE BODY (drawn first so head overlaps it) */}
            <path
              d="M 112,172 C 88,184 64,218 54,258 Q 98,276 150,276 Q 202,276 246,258 C 236,218 212,184 188,172 Q 164,162 150,163 Q 136,162 112,172 Z"
              fill="url(#tla-robe)" stroke="#3D2A1A" strokeWidth="2.5"
            />
            {/* Robe center highlight */}
            <path
              d="M 140,174 C 136,198 135,228 137,262 Q 150,267 163,262 C 165,228 164,198 160,174 Q 156,168 150,167 Q 144,168 140,174 Z"
              fill="white" opacity="0.13"
            />
            {/* Robe fold lines */}
            <path d="M 128,182 C 122,210 119,240 121,264" stroke="#3D2A1A" strokeWidth="1.2" opacity="0.22" strokeLinecap="round" />
            <path d="M 172,182 C 178,210 181,240 179,264" stroke="#3D2A1A" strokeWidth="1.2" opacity="0.22" strokeLinecap="round" />
            {/* V-collar */}
            <path d="M 134,172 Q 150,184 166,172" stroke="#3D2A1A" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* LOTUS LEGS */}
            <ellipse cx="108" cy="268" rx="36" ry="16" fill="url(#tla-robe)" stroke="#3D2A1A" strokeWidth="2" />
            <ellipse cx="192" cy="268" rx="36" ry="16" fill="url(#tla-robe)" stroke="#3D2A1A" strokeWidth="2" />
            {/* Lap center — slightly darker */}
            <ellipse cx="150" cy="268" rx="30" ry="14" fill="#C07018" stroke="#3D2A1A" strokeWidth="1.5" />

            {/* HANDS — dhyana mudra */}
            <ellipse cx="150" cy="258" rx="23" ry="11" fill="#F4C09A" stroke="#3D2A1A" strokeWidth="2" />
            {/* Glowing orb in hands */}
            <circle cx="150" cy="257" r="5.5" fill="#E8C070" opacity="0.9" />
            <circle cx="150" cy="257" r="2.5" fill="white" opacity="0.75" />

            {/* HEAD */}
            {/* Ears (behind head) */}
            <ellipse cx="112" cy="126" rx="9" ry="13" fill="#F4C09A" stroke="#3D2A1A" strokeWidth="2.5" />
            <ellipse cx="188" cy="126" rx="9" ry="13" fill="#F4C09A" stroke="#3D2A1A" strokeWidth="2.5" />

            {/* Head main */}
            <ellipse cx="150" cy="120" rx="40" ry="44" fill="#F4C09A" stroke="#3D2A1A" strokeWidth="2.5" />

            {/* Head shading — subtle cheek depth */}
            <ellipse cx="130" cy="130" rx="16" ry="12" fill="#E8A878" opacity="0.18" />
            <ellipse cx="170" cy="130" rx="16" ry="12" fill="#E8A878" opacity="0.18" />

            {/* Topknot bump */}
            <ellipse cx="150" cy="77" rx="16" ry="10" fill="#F4C09A" stroke="#3D2A1A" strokeWidth="2" />
            {/* Topknot band */}
            <path d="M 136,81 Q 150,86 164,81" stroke="#3D2A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />

            {/* Neck */}
            <rect x="140" y="160" width="20" height="14" rx="5" fill="#F4C09A" stroke="#3D2A1A" strokeWidth="2" />

            {/* ARROW TATTOO (Air Nation — blue arrow pointing down on forehead) */}
            {/* Arrow shaft */}
            <rect x="148" y="100" width="4" height="18" rx="1.5" fill="#5A90C0" stroke="#3D2A1A" strokeWidth="1.2" />
            {/* Arrow head */}
            <polygon points="150,87 143,102 157,102" fill="#5A90C0" stroke="#3D2A1A" strokeWidth="1.2" strokeLinejoin="round" />
            {/* Arrow wing left */}
            <path d="M 143,102 L 136,97 L 143,107" fill="#5A90C0" stroke="#3D2A1A" strokeWidth="1" strokeLinejoin="round" />
            {/* Arrow wing right */}
            <path d="M 157,102 L 164,97 L 157,107" fill="#5A90C0" stroke="#3D2A1A" strokeWidth="1" strokeLinejoin="round" />

            {/* CLOSED EYES — thick TLA-style arcs */}
            <path d="M 126,122 Q 136,114 146,122" stroke="#3D2A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 154,122 Q 164,114 174,122" stroke="#3D2A1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Lower eyelid (slight) */}
            <path d="M 127,124 Q 136,127 145,124" stroke="#3D2A1A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
            <path d="M 155,124 Q 164,127 173,124" stroke="#3D2A1A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />

            {/* ROSY CHEEKS */}
            <ellipse cx="124" cy="140" rx="12" ry="8" fill="#E88888" opacity="0.24" />
            <ellipse cx="176" cy="140" rx="12" ry="8" fill="#E88888" opacity="0.24" />

            {/* SMILE */}
            <path d="M 135,156 Q 150,165 165,156" stroke="#3D2A1A" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Nose hint */}
            <path d="M 150,136 Q 153,143 150,146" stroke="#3D2A1A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.35" />
          </g>
        </svg>
      </motion.div>

      <motion.p
        animate={{ opacity: [0.4, 0.65, 0.4] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="mt-3 text-xs text-monk-muted tracking-[0.35em] uppercase"
      >
        breathe
      </motion.p>
    </div>
  );
}
