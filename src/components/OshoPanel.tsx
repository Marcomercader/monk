"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OSHO_TEACHINGS = [
  {
    text: "Meditation is nothing but a device to make you aware of your real self — which is not created by you, which need not be created by you, which you already are.",
    label: "On Meditation",
  },
  {
    text: "The real question is not whether life exists after death. The real question is whether you are alive before death. Are you really alive? Or are you just dragging yourself from the cradle to the grave?",
    label: "On Aliveness",
  },
  {
    text: "Don't seek, don't search, don't ask, don't knock, don't demand — relax. If you relax, it comes. If you relax, it is there. If you relax, you start vibrating with it.",
    label: "On Surrender",
  },
  {
    text: "To be in the present moment is the greatest miracle. The whole existence is here — the trees are here, the birds are here, you are here. But to be totally here, that's what meditation is.",
    label: "On Presence",
  },
  {
    text: "Laughter is the most sacred thing in existence. God has given you the capacity to laugh — it is the most precious thing. A man who can laugh totally, wholeheartedly, has found the way.",
    label: "On Joy",
  },
];

interface OshoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OshoPanel({ isOpen, onClose }: OshoPanelProps) {
  const [activeTeaching, setActiveTeaching] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-monk-surface border-l border-monk-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-monk-border">
              <div>
                <h2 className="text-base font-semibold text-monk-text">
                  Osho Teachings
                </h2>
                <p className="text-xs text-monk-muted mt-0.5">
                  Reflections for the journey
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-monk-muted hover:text-monk-text hover:bg-monk-bg transition-all cursor-pointer text-xl leading-none"
                aria-label="Close panel"
              >
                ×
              </button>
            </div>

            {/* Bio blurb */}
            <div className="px-6 py-5 border-b border-monk-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-monk-warm/30 flex items-center justify-center text-xl">
                  ☯
                </div>
                <div>
                  <p className="text-sm font-medium text-monk-text">Osho</p>
                  <p className="text-xs text-monk-muted">1931 – 1990</p>
                </div>
              </div>
              <p className="text-xs text-monk-muted leading-relaxed">
                Bhagwan Shree Rajneesh — known as Osho — was an Indian mystic
                and spiritual teacher who synthesized Eastern spiritual practices
                with Western psychology. His teachings emphasize awareness,
                meditation, and the celebration of life as a path to inner
                freedom.
              </p>
            </div>

            {/* Teaching selector */}
            <div className="px-6 py-4 border-b border-monk-border">
              <p className="text-xs font-semibold text-monk-muted uppercase tracking-widest mb-3">
                Teachings
              </p>
              <div className="flex flex-wrap gap-2">
                {OSHO_TEACHINGS.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTeaching(i)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      activeTeaching === i
                        ? "bg-monk-accent text-white border-monk-accent"
                        : "border-monk-border text-monk-muted hover:border-monk-accent hover:text-monk-text"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active teaching quote */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeTeaching}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <span className="absolute -left-2 -top-3 text-5xl text-monk-warm opacity-30 font-serif leading-none">
                    &ldquo;
                  </span>
                  <p className="text-sm text-monk-text leading-relaxed pl-4 italic">
                    {OSHO_TEACHINGS[activeTeaching].text}
                  </p>
                  <footer className="mt-4 pl-4 text-xs text-monk-warm">
                    — Osho, {OSHO_TEACHINGS[activeTeaching].label}
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-monk-border">
              <p className="text-xs text-monk-muted text-center opacity-60">
                &ldquo;Be silent. Know thyself. Be blissful.&rdquo;
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
