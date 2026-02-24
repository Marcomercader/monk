"use client";

import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onOshoOpen: () => void;
}

export default function Header({ onOshoOpen }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-6 py-4 border-b border-monk-border bg-monk-surface/80 backdrop-blur-sm sticky top-0 z-30"
    >
      {/* App name */}
      <h1 className="text-xl font-light tracking-[0.2em] text-monk-text lowercase">
        monk
      </h1>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
          onClick={onOshoOpen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-monk-border text-monk-muted hover:text-monk-text hover:border-monk-accent text-sm transition-all cursor-pointer"
          aria-label="Open Osho teachings"
        >
          <span>☯</span>
          <span className="hidden sm:inline font-light">Osho</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
