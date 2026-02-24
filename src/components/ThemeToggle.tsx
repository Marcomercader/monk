"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("monk_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("monk_theme", "light");
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      onClick={toggle}
      className="p-2 rounded-full text-monk-muted hover:text-monk-text transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      <motion.span
        key={isDark ? "sun" : "moon"}
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl block"
      >
        {isDark ? "☀" : "🌙"}
      </motion.span>
    </motion.button>
  );
}
