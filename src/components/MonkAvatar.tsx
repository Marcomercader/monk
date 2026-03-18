"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MonkAvatarProps {
  score: number; // 1–5
}

// ── LEVEL 1: Standing, slouched, heavy, earthbound ──
function MonkLevel1() {
  return (
    <svg viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ground shadow */}
      <ellipse cx="100" cy="412" rx="58" ry="8" fill="rgba(0,0,0,0.14)" />

      {/* Head — drooped forward */}
      <ellipse cx="97" cy="62" rx="34" ry="38" fill="#111" transform="rotate(6,97,62)" />
      <ellipse cx="96" cy="59" rx="24" ry="27" fill="#f0f0f0" transform="rotate(6,96,59)" />
      {/* Heavy furrowed brows */}
      <path d="M80,51 Q87,46 94,49" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M98,49 Q105,46 112,51" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Downcast eyes */}
      <path d="M79,58 Q86,65 93,59" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M99,59 Q106,65 113,58" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Downturned mouth */}
      <path d="M84,72 Q92,68 100,72" stroke="#555" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="86" y="95" width="20" height="16" rx="3" fill="#111" />

      {/* Body — hunched, rounded shoulders */}
      <path d="M68,108 C48,118 44,155 45,198 C46,240 50,295 54,400 L152,400 C154,295 156,240 155,198 C156,155 150,118 130,108 Z" fill="#111" />

      {/* Left arm — hanging heavy and forward */}
      <path d="M68,112 C46,124 36,158 34,194 C33,222 36,258 40,282 C47,275 52,258 52,236 C52,210 50,182 54,156 C56,143 62,128 70,118 Z" fill="#111" />

      {/* Right arm */}
      <path d="M130,112 C152,124 162,158 164,194 C165,222 162,258 158,282 C151,275 146,258 146,236 C146,210 148,182 144,156 C142,143 136,128 128,118 Z" fill="#111" />

      {/* Robe folds */}
      <path d="M88,112 Q84,165 82,260" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45" />
      <path d="M112,114 Q116,168 118,262" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.35" />

      {/* Legs */}
      <path d="M64,355 C62,372 61,388 61,400 L98,400 C98,388 97,372 95,355 Z" fill="#111" />
      <path d="M136,355 C138,372 139,388 139,400 L102,400 C102,388 103,372 105,355 Z" fill="#111" />

      {/* Feet */}
      <ellipse cx="78" cy="402" rx="22" ry="8" fill="#111" />
      <ellipse cx="122" cy="402" rx="22" ry="8" fill="#111" />
    </svg>
  );
}

// ── LEVEL 2: Standing upright, composed, aware ──
// ── LEVEL 3: Seated cross-legged on ground, hands on knees ──
function MonkLevel3() {
  return (
    <svg viewBox="0 0 300 330" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ground shadow */}
      <ellipse cx="150" cy="324" rx="105" ry="9" fill="rgba(0,0,0,0.11)" />

      {/* Lower body — lotus on ground */}
      <path d="M32,240 Q24,272 36,306 Q62,318 150,320 Q238,318 264,306 Q276,272 268,240 Q240,224 200,225 Q176,229 163,236 Q150,240 137,236 Q124,229 100,225 Q60,224 32,240 Z" fill="#111" />

      {/* Torso */}
      <path d="M106,122 C85,130 72,156 70,186 C68,212 73,232 88,238 Q118,246 150,246 Q182,246 212,238 C227,232 232,212 230,186 C228,156 215,130 194,122 Z" fill="#111" />

      {/* Head */}
      <ellipse cx="150" cy="62" rx="46" ry="52" fill="#111" />
      <ellipse cx="150" cy="59" rx="34" ry="40" fill="#f0f0f0" />
      <path d="M130,49 Q140,45 148,48" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M152,48 Q160,45 170,49" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M130,60 Q139,67 148,60" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M152,60 Q161,67 170,60" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M138,74 Q150,80 162,74" stroke="#555" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Left arm — exposed, resting toward knee */}
      <path d="M106,126 C84,136 68,162 65,188 C65,204 76,214 88,210 C97,192 103,170 116,150 Z" fill="#e4e4e4" />
      <path d="M106,126 C84,136 68,162 65,188 C65,204 76,214 88,210 C97,192 103,170 116,150 Z" stroke="#111" strokeWidth="1.5" fill="none" />

      {/* Hands on knees */}
      <ellipse cx="68" cy="244" rx="24" ry="14" fill="#111" transform="rotate(-12,68,244)" />
      <ellipse cx="232" cy="244" rx="24" ry="14" fill="#111" transform="rotate(12,232,244)" />

      {/* Robe folds */}
      <path d="M124,134 Q120,176 118,228" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M172,136 Q176,178 178,230" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55" />

      {/* Leg highlights */}
      <path d="M38,248 Q30,274 44,298 Q58,306 78,302 Q58,288 56,264 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M262,248 Q270,274 256,298 Q242,306 222,302 Q242,288 244,264 Z" fill="rgba(255,255,255,0.2)" />
      <path d="M108,250 Q132,262 150,263 Q168,263 192,254" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}

// ── LEVEL 4: Seated floating, prayer hands, soft glow ──
function MonkLevel4() {
  return (
    <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Distant faint shadow */}
      <ellipse cx="150" cy="336" rx="82" ry="6" fill="rgba(0,0,0,0.06)" />

      {/* Soft glow rings */}
      <ellipse cx="150" cy="162" rx="128" ry="116" fill="rgba(220,190,90,0.05)" />
      <ellipse cx="150" cy="162" rx="100" ry="90" fill="rgba(220,190,90,0.07)" />
      <ellipse cx="150" cy="162" rx="74" ry="66" fill="rgba(220,190,90,0.08)" />

      {/* Lower body — lotus, elevated */}
      <path d="M36,212 Q28,246 40,278 Q66,292 150,294 Q234,292 260,278 Q272,246 264,212 Q237,197 196,198 Q174,202 162,209 Q150,213 138,209 Q126,202 104,198 Q63,197 36,212 Z" fill="#111" />

      {/* Torso */}
      <path d="M106,104 C85,112 72,138 70,168 C68,194 74,214 88,220 Q118,228 150,228 Q182,228 212,220 C226,214 232,194 230,168 C228,138 215,112 194,104 Z" fill="#111" />

      {/* Head */}
      <ellipse cx="150" cy="46" rx="46" ry="52" fill="#111" />
      <ellipse cx="150" cy="43" rx="34" ry="40" fill="#f0f0f0" />
      <path d="M130,33 Q140,29 148,32" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M152,32 Q160,29 170,33" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M130,44 Q139,51 148,44" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M152,44 Q161,51 170,44" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M138,58 Q150,65 162,58" stroke="#444" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Left arm */}
      <path d="M106,108 C84,118 68,144 66,170 C66,186 76,196 88,192 C97,174 103,152 116,132 Z" fill="#e4e4e4" />
      <path d="M106,108 C84,118 68,144 66,170 C66,186 76,196 88,192 C97,174 103,152 116,132 Z" stroke="#111" strokeWidth="1.5" fill="none" />

      {/* Prayer hands */}
      <path d="M138,136 C132,145 130,158 130,172 C130,187 134,198 138,202 L150,204 L162,202 C166,198 170,187 170,172 C170,158 168,145 162,136 C157,129 154,127 150,126 C146,127 143,129 138,136 Z" fill="#e0e0e0" />
      <path d="M138,136 C132,145 130,158 130,172 C130,187 134,198 138,202 L150,204 L162,202 C166,198 170,187 170,172 C170,158 168,145 162,136 C157,129 154,127 150,126 C146,127 143,129 138,136 Z" stroke="#111" strokeWidth="1.8" fill="none" />
      <line x1="150" y1="128" x2="150" y2="203" stroke="#222" strokeWidth="1.8" />
      <line x1="143" y1="132" x2="142" y2="202" stroke="#555" strokeWidth="1" />
      <line x1="157" y1="132" x2="158" y2="202" stroke="#555" strokeWidth="1" />

      {/* Robe folds */}
      <path d="M124,117 Q120,157 118,207" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M172,119 Q176,159 178,209" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Leg highlights */}
      <path d="M42,220 Q34,246 46,270 Q60,278 80,274 Q60,260 58,238 Z" fill="rgba(255,255,255,0.22)" />
      <path d="M258,220 Q266,246 254,270 Q240,278 220,274 Q240,260 242,238 Z" fill="rgba(255,255,255,0.22)" />
      <path d="M108,222 Q132,234 150,235 Q168,235 192,226" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// ── LEVEL 5: Fully floating, enlightened, radiant ──
function MonkLevel5() {
  return (
    <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Barely visible distant shadow */}
      <ellipse cx="150" cy="336" rx="60" ry="4" fill="rgba(0,0,0,0.04)" />

      {/* Radiant glow — concentric rings */}
      <ellipse cx="150" cy="155" rx="148" ry="134" fill="rgba(240,210,80,0.04)" />
      <ellipse cx="150" cy="155" rx="124" ry="112" fill="rgba(240,210,80,0.05)" />
      <ellipse cx="150" cy="155" rx="100" ry="90" fill="rgba(240,210,80,0.07)" />
      <ellipse cx="150" cy="155" rx="76" ry="68" fill="rgba(240,210,80,0.09)" />
      <ellipse cx="150" cy="155" rx="54" ry="48" fill="rgba(240,210,80,0.08)" />

      {/* Lower body — lotus, high float */}
      <path d="M40,198 Q32,232 44,264 Q70,278 150,280 Q230,278 256,264 Q268,232 260,198 Q233,184 192,185 Q170,189 161,196 Q150,200 139,196 Q130,189 108,185 Q67,184 40,198 Z" fill="#111" />

      {/* Torso */}
      <path d="M108,92 C88,100 76,126 74,156 C72,182 78,202 92,208 Q120,216 150,216 Q180,216 208,208 C222,202 228,182 226,156 C224,126 212,100 192,92 Z" fill="#111" />

      {/* Head */}
      <ellipse cx="150" cy="36" rx="46" ry="52" fill="#111" />
      <ellipse cx="150" cy="33" rx="34" ry="40" fill="#f0f0f0" />
      {/* Serene brows */}
      <path d="M130,23 Q140,19 148,22" stroke="#666" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M152,22 Q160,19 170,23" stroke="#666" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* Deeply closed eyes */}
      <path d="M130,34 Q139,41 148,34" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M152,34 Q161,41 170,34" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Blissful smile */}
      <path d="M136,48 Q150,57 164,48" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Left arm */}
      <path d="M108,96 C86,106 70,132 68,158 C68,174 78,184 90,180 C99,162 105,140 118,120 Z" fill="#e4e4e4" />
      <path d="M108,96 C86,106 70,132 68,158 C68,174 78,184 90,180 C99,162 105,140 118,120 Z" stroke="#111" strokeWidth="1.5" fill="none" />

      {/* Prayer hands */}
      <path d="M138,122 C132,131 130,144 130,158 C130,173 134,184 138,188 L150,190 L162,188 C166,184 170,173 170,158 C170,144 168,131 162,122 C157,115 154,113 150,112 C146,113 143,115 138,122 Z" fill="#e8e8e8" />
      <path d="M138,122 C132,131 130,144 130,158 C130,173 134,184 138,188 L150,190 L162,188 C166,184 170,173 170,158 C170,144 168,131 162,122 C157,115 154,113 150,112 C146,113 143,115 138,122 Z" stroke="#111" strokeWidth="1.8" fill="none" />
      <line x1="150" y1="114" x2="150" y2="189" stroke="#222" strokeWidth="1.8" />
      <line x1="143" y1="118" x2="142" y2="188" stroke="#555" strokeWidth="1" />
      <line x1="157" y1="118" x2="158" y2="188" stroke="#555" strokeWidth="1" />
      <line x1="136" y1="130" x2="135" y2="184" stroke="#888" strokeWidth="0.8" />
      <line x1="164" y1="130" x2="165" y2="184" stroke="#888" strokeWidth="0.8" />

      {/* Robe folds */}
      <path d="M126,105 Q122,145 120,194" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.65" />
      <path d="M174,107 Q178,147 180,196" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65" />
      <path d="M136,103 Q132,140 130,190" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.3" />

      {/* Leg highlights */}
      <path d="M46,206 Q38,232 50,256 Q64,264 84,260 Q64,246 62,224 Z" fill="rgba(255,255,255,0.24)" />
      <path d="M254,206 Q262,232 250,256 Q236,264 216,260 Q236,246 238,224 Z" fill="rgba(255,255,255,0.24)" />
      <path d="M108,208 Q132,220 150,221 Q168,221 192,212" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.52" />
    </svg>
  );
}

// Level 2 = sitting (reuse MonkLevel3 SVG)
const COMPONENTS = { 1: MonkLevel1, 2: MonkLevel3, 3: MonkLevel3, 4: MonkLevel4, 5: MonkLevel5 };

// Subtle micro-animations only — macro position handled by page.tsx
type AnimTarget = { x?: number[]; y?: number[] };
const ANIMATIONS: Record<number, { motion: AnimTarget; duration: number }> = {
  1: { motion: { x: [-3, 3, -3] }, duration: 7 },
  2: { motion: { y: [0, -3, 0] },  duration: 6 },
  3: { motion: { y: [0, -4, 0] },  duration: 6 },
  4: { motion: { y: [0, -5, 0] },  duration: 5 },
  5: { motion: { y: [0, -6, 0] },  duration: 4 },
};

export default function MonkAvatar({ score }: MonkAvatarProps) {
  const level = (Math.max(1, Math.min(5, score || 3))) as 1 | 2 | 3 | 4 | 5;
  const MonkComponent = COMPONENTS[level];
  const anim = ANIMATIONS[level];
  const isStanding = level === 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={level}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="flex flex-col items-center select-none"
        style={{ height: "16.5vh", aspectRatio: isStanding ? "1/2" : "1/1.15" }}
      >
        <div className="relative w-full h-full">
          {/* Glow layer for levels 4–5 */}
          {level >= 4 && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: level === 5 ? 3 : 5, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 70% 60% at 50% 52%, rgba(240,210,80,${level === 5 ? 0.22 : 0.12}) 0%, transparent 100%)`,
              }}
            />
          )}

          <motion.div
            animate={anim.motion}
            transition={{ repeat: Infinity, duration: anim.duration, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <MonkComponent />
          </motion.div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
