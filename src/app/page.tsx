"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import MonkAvatar from "@/components/MonkAvatar";
import QuoteOfDay from "@/components/QuoteOfDay";
import OshoPanel from "@/components/OshoPanel";
import GoalCalendar from "@/components/GoalCalendar";
import ThemeToggle from "@/components/ThemeToggle";

interface NavCardProps {
  icon: string;
  label: string;
  sub?: string;
  onClick?: () => void;
  href?: string;
}

function NavCard({ icon, label, sub, onClick, href }: NavCardProps) {
  const inner = (
    <motion.div
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.96 }}
      className="group w-28 py-5 flex flex-col items-center gap-2 rounded-2xl border border-monk-border bg-monk-surface/80 backdrop-blur-sm hover:border-monk-accent hover:bg-monk-surface transition-all cursor-pointer shadow-sm"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs font-medium tracking-wide text-monk-text group-hover:text-monk-accent transition-colors">
          {label}
        </span>
        {sub && (
          <span className="text-[10px] text-monk-muted opacity-60">{sub}</span>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return (
    <button onClick={onClick} className="focus:outline-none">
      {inner}
    </button>
  );
}

export default function Home() {
  const [oshoOpen, setOshoOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-monk-bg text-monk-text">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-4 z-20 relative">
        <h1 className="text-xl font-light tracking-[0.25em] text-monk-text lowercase opacity-80">
          monk
        </h1>
        <ThemeToggle />
      </header>

      {/* Hero layout */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
        {/* Desktop: side buttons flanking avatar */}
        <div className="flex items-center justify-center gap-6 lg:gap-10 w-full max-w-3xl">
          {/* Left nav */}
          <div className="hidden sm:flex flex-col gap-4">
            <NavCard icon="📅" label="Calendar" sub="intentions" onClick={() => setCalendarOpen(true)} />
            <NavCard icon="☯" label="Osho" sub="chat" onClick={() => setOshoOpen(true)} />
          </div>

          {/* Center: monk avatar */}
          <div className="flex-shrink-0">
            <MonkAvatar />
          </div>

          {/* Right nav */}
          <div className="hidden sm:flex flex-col gap-4">
            <NavCard icon="🎯" label="Goals" sub="manage" href="/goals" />
            <NavCard icon="⭐" label="Rate" sub="today" href="/rate" />
          </div>
        </div>

        {/* Mobile: 2×2 grid below avatar */}
        <div className="sm:hidden mt-6 grid grid-cols-2 gap-3 w-full max-w-xs">
          <NavCard icon="📅" label="Calendar" onClick={() => setCalendarOpen(true)} />
          <NavCard icon="☯" label="Osho" onClick={() => setOshoOpen(true)} />
          <NavCard icon="🎯" label="Goals" href="/goals" />
          <NavCard icon="⭐" label="Rate" href="/rate" />
        </div>
      </main>

      {/* Footer quote */}
      <QuoteOfDay />

      {/* Drawers */}
      <OshoPanel isOpen={oshoOpen} onClose={() => setOshoOpen(false)} />
      <GoalCalendar isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />
    </div>
  );
}
